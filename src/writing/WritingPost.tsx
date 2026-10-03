import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SideNav, ContactRail, MobileHeader } from "@/scenes/navbar";
import SiteFooter from "@/scenes/SiteFooter";
import { posts, getPost, formatDate, PostKind } from "./posts";
import Markdown, { slugify } from "./Markdown";
import Thumbnail from "./Thumbnail";
import "./writing.css";

const KIND_LABEL: Record<PostKind, string> = {
  essay: "essay",
  note: "note",
};

interface TocItem {
  depth: 2 | 3;
  text: string;
  id: string;
}

/** Headings (## / ###) outside code fences. Journal date headings are kept
 *  so a long journal can be jumped through by entry. */
const buildToc = (body: string): TocItem[] => {
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(/^(##|###)\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const text = m[2].replace(/[*_`~]/g, "");
    items.push({ depth: m[1].length as 2 | 3, text, id: slugify(text) });
  }
  return items;
};

const useActiveHeading = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!ids.length) return;
    const onScroll = () => {
      const line = 120;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
};

const Toc: React.FC<{ items: TocItem[] }> = ({ items }) => {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const active = useActiveHeading(ids);
  if (!items.length) return null;
  return (
    <nav className="wr-toc" aria-label="On this page">
      <div className="text-[10px] text-faint tracking-[0.12em] uppercase mb-2">on this page</div>
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} data-depth={i.depth} data-active={active === i.id}>
          {i.text}
        </a>
      ))}
    </nav>
  );
};

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const WritingPost: React.FC = () => {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    if (!post) return;
    const prev = document.title;
    document.title = `${post.title} — Angelina Wang`;
    return () => {
      document.title = prev;
    };
  }, [post]);

  // scroll to hash after the markdown mounts
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    el?.scrollIntoView({ block: "start" });
  }, [slug]);

  const toc = useMemo(() => (post ? buildToc(post.body) : []), [post]);

  if (!post) return <Navigate to="/writing" replace />;

  const idx = posts.findIndex((p) => p.slug === post.slug);
  const newer = posts[idx - 1];
  const older = posts[idx + 1];

  return (
    <div className="app">
      <SideNav active="writing" />
      <ContactRail />
      <div className="max-w-[1080px] mx-auto px-6">
        <MobileHeader active="writing" />

        <div className="pt-40 pb-24 mx-auto max-w-[680px] lg:max-w-none lg:grid lg:grid-cols-[1fr_680px_1fr] lg:gap-x-10">
          {/* header + body live in the middle column; toc hangs in the right gutter */}
          <div className="lg:col-start-2">
            <motion.div {...enter(0)}>
              <Link
                to="/writing"
                className="inline-flex items-center gap-1.5 text-[12px] text-mute hover:text-ink transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                all writing
              </Link>
            </motion.div>

            <motion.header {...enter(0.08)} className="mt-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-mute">
                <span className="px-1.5 h-[16px] inline-flex items-center rounded-full bg-card text-ink/70">
                  {KIND_LABEL[post.kind]}
                </span>
                <span>{formatDate(post.date)}</span>
                {post.updated && <span className="text-faint">updated {formatDate(post.updated)}</span>}
                <span className="text-faint">{post.readingMinutes} min read</span>
                {post.draft && <span className="text-acc-orange">draft</span>}
              </div>
              <h1 className="mt-4 font-serif text-[32px] md:text-[40px] font-semibold tracking-[-0.015em] leading-[1.12] [font-variation-settings:'opsz'_60]">
                {post.title}
              </h1>
              {post.description && (
                <p className="mt-4 font-serif italic text-[17px] leading-relaxed text-ink/70">
                  {post.description}
                </p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10.5px] leading-none h-[18px] px-2 inline-flex items-center rounded-full border border-ink/[0.1] text-mute"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.header>

            {post.thumbnail && (
              <motion.div {...enter(0.12)} className="mt-8">
                <Thumbnail src={post.thumbnail} />
              </motion.div>
            )}

            <motion.article {...enter(0.16)} className="mt-10">
              <Markdown source={post.body} />
            </motion.article>

            <motion.footer
              {...enter(0.24)}
              className="mt-20 pt-6 border-t border-ink/[0.08] grid grid-cols-2 gap-6 text-[12px]"
            >
              <div>
                {older && (
                  <Link to={`/writing/${older.slug}`} className="group inline-flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-[10.5px] text-faint">
                      <ArrowLeft className="w-3 h-3" /> older
                    </span>
                    <span className="font-serif text-[15px] font-semibold group-hover:underline underline-offset-4 decoration-faint">
                      {older.title}
                    </span>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {newer && (
                  <Link to={`/writing/${newer.slug}`} className="group inline-flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-[10.5px] text-faint">
                      newer <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="font-serif text-[15px] font-semibold group-hover:underline underline-offset-4 decoration-faint">
                      {newer.title}
                    </span>
                  </Link>
                )}
              </div>
            </motion.footer>
          </div>

          {toc.length > 0 && (
            <motion.aside
              {...enter(0.3)}
              className="hidden lg:block lg:col-start-3 lg:row-start-1 self-start sticky top-40 max-w-[220px]"
            >
              <Toc items={toc} />
            </motion.aside>
          )}
        </div>
        <SiteFooter />
      </div>
    </div>
  );
};

export default WritingPost;
