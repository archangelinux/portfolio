// Copies llm-inference/GUIDE.md into src/content/writing/ as a post. GUIDE.md is
// the source of truth; edit it there, then run `npm run sync:guide` here.
// Repo-relative media (charts, video) is copied into public/writing/<slug>/ and
// repo-relative links are pointed at GitHub.
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, basename } from "node:path";

const root = resolve(import.meta.dirname, "..");
const repo = resolve(process.env.LLM_REPO ?? resolve(root, "../llm-inference"));
const github = "https://github.com/archangelinux/llm-inference/blob/main";
const slug = "llm-inference-by-parts";

const frontmatter = `---
title: llm-inference-by-parts, Part 1
description: A from-scratch transformer inference engine and serving layer for GPT-2 and Qwen3, built and benchmarked one mechanism at a time.
date: 2026-10-03
tags: [ml, inference, pytorch, cuda]
kind: essay
draft: true
---`;

const mediaDir = resolve(root, "public/writing", slug);
mkdirSync(mediaDir, { recursive: true });

const isRelative = (p) => !/^([a-z]+:|\/|#)/i.test(p);
const media = /\.(png|jpe?g|gif|webp|svg|mp4|webm)$/i;
let copied = 0, missing = [];

const rewrite = (path) => {
  if (!isRelative(path)) return path;
  if (!media.test(path)) return `${github}/${path}`;
  const src = resolve(repo, path);
  if (existsSync(src)) { copyFileSync(src, resolve(mediaDir, basename(path))); copied++; }
  else missing.push(path);
  return `/writing/${slug}/${basename(path)}`;
};

// title comes from the frontmatter here, so drop GUIDE.md's own `# ` heading
const guide = readFileSync(resolve(repo, "GUIDE.md"), "utf8").replace(/^# .*\n+/, "");

// leave fenced code blocks alone; only rewrite paths in prose
const body = guide
  .split(/(^```[\s\S]*?^```)/m)
  .map((chunk, i) => i % 2 ? chunk : chunk
    .replace(/(\]\()([^)\s]+)/g, (_, pre, p) => pre + rewrite(p))
    .replace(/(src=")([^"]+)/g, (_, pre, p) => pre + rewrite(p)))
  .join("");

const out = resolve(root, "src/content/writing", `${slug}.md`);
writeFileSync(out, `${frontmatter}\n<!-- generated from llm-inference/GUIDE.md by scripts/sync-guide.mjs; edit there -->\n\n${body}`);
console.log(`wrote ${out}\n${copied} media files copied to public/writing/${slug}/`);
if (missing.length) console.log(`not found in ${repo}:\n  ${missing.join("\n  ")}`);
