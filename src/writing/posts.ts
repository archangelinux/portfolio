/**
 * Content loader for /writing.
 *
 * Every `.md` file in `src/content/writing/` becomes a post. To publish a new
 * one, drop in a file — nothing else to register. The frontmatter block at the
 * top of the file is the only metadata:
 *
 * ---
 * title: Finance in practice
 * description: A running journal from my Wealthsimple term.
 * date: 2026-09-03          # ISO date; used for ordering + display
 * updated: 2026-09-05       # optional
 * tags: [finance, co-op]    # optional
 * kind: essay               # optional: essay | note (default note)
 * thumbnail: my-post.png   # optional: image filename in src/assets
 * draft: true               # optional: hidden in production builds
 * ---
 *
 * The URL slug is the filename (e.g. `finance-in-practice.md` → /writing/finance-in-practice).
 */

export type PostKind = "essay" | "note";

export interface PostMeta {
  slug: string;
  title: string;
  description?: string;
  date: string;
  updated?: string;
  tags: string[];
  kind: PostKind;
  draft: boolean;
  thumbnail?: string;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  body: string;
}

const raw = import.meta.glob<string>("../content/writing/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// thumbnails live in src/assets; frontmatter names the file, this resolves it to a bundled url
const assetUrls = import.meta.glob<string>("../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const parseValue = (v: string): string | string[] | boolean => {
  const t = v.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (t.startsWith("[") && t.endsWith("]")) {
    return t
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return t.replace(/^["']|["']$/g, "");
};

const parseFrontmatter = (src: string): { data: Record<string, unknown>; body: string } => {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const data: Record<string, unknown> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1 || line.trim().startsWith("#")) continue;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).replace(/\s+#.*$/, "");
    data[key] = parseValue(val);
  }
  return { data, body: m[2] };
};

const wordsPerMinute = 220;

const toPost = (path: string, src: string): Post => {
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  const { data, body } = parseFrontmatter(src);
  const words = body.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  const kind = (["essay", "note"] as const).find((k) => k === data.kind) ?? "note";
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : undefined,
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    updated: typeof data.updated === "string" ? data.updated : undefined,
    tags,
    kind,
    draft: data.draft === true,
    thumbnail: typeof data.thumbnail === "string" ? assetUrls[`../assets/${data.thumbnail}`] : undefined,
    readingMinutes: Math.max(1, Math.round(words / wordsPerMinute)),
    body,
  };
};

export const posts: Post[] = Object.entries(raw)
  .map(([path, src]) => toPost(path, src))
  .filter((p) => import.meta.env.DEV || !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const getPost = (slug: string): Post | undefined => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string): string => {
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
