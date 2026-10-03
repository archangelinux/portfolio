import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SideNav, ContactRail, MobileHeader } from "@/scenes/navbar";
import SiteFooter from "@/scenes/SiteFooter";
import { posts, formatDate, PostKind } from "./posts";
import "./writing.css";

const KIND_LABEL: Record<PostKind, string> = {
  essay: "essay",
  note: "note",
};

const FILTERS: { id: PostKind | "all"; label: string }[] = [
  { id: "all", label: "all" },
  { id: "essay", label: "essays" },
  { id: "note", label: "notes" },
];

const fade = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
});

const WritingIndex: React.FC = () => {
  const [filter, setFilter] = useState<PostKind | "all">("all");
  const visible = posts.filter((p) => filter === "all" || p.kind === filter);
  const years = Array.from(new Set(visible.map((p) => p.date.slice(0, 4))));

  return (
    <div className="app">
      <SideNav active="writing" />
      <ContactRail />
      <div className="max-w-[1080px] mx-auto px-6">
        <MobileHeader active="writing" />

        <main className="pt-40 pb-24 mx-auto max-w-[680px]">
          <motion.header {...fade(0)}>
            <h1 className="page-title">
              writing
            </h1>
            <div className="mt-5 flex items-center gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`text-[11px] leading-none h-[20px] px-2.5 rounded-full transition-colors duration-300 ${
                    filter === f.id ? "bg-pill text-ink" : "text-mute hover:bg-pill-faint hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.header>

          <div className="mt-12 space-y-12">
            {years.map((year, yi) => (
              <section key={year}>
                <motion.h2 {...fade(1 + yi)} className="text-[11px] text-faint tracking-[0.12em] mb-4">
                  {year}
                </motion.h2>
                <ul className="divide-y divide-ink/[0.06] border-t border-b border-ink/[0.06]">
                  {visible
                    .filter((p) => p.date.startsWith(year))
                    .map((p, i) => (
                      <motion.li key={p.slug} {...fade(2 + yi + i)}>
                        <Link
                          to={`/writing/${p.slug}`}
                          className="group grid grid-cols-[72px_1fr] md:grid-cols-[96px_1fr_auto] gap-x-4 py-4 items-baseline"
                        >
                          <span className="text-[11px] text-mute tabular-nums">
                            {formatDate(p.date).replace(`, ${year}`, "")}
                          </span>
                          <span className="min-w-0 flex items-start gap-4">
                            <span className="min-w-0 flex-1">
                              <span className="block font-serif text-[18px] font-semibold tracking-[-0.01em] leading-snug group-hover:underline underline-offset-4 decoration-faint">
                                {p.title}
                                {p.draft && (
                                  <span className="ml-2 text-[10px] font-normal text-acc-orange">draft</span>
                                )}
                              </span>
                              {p.description && (
                                <span className="block mt-1 font-serif text-[14px] text-mute leading-relaxed">
                                  {p.description}
                                </span>
                              )}
                              <span className="md:hidden block mt-1.5 text-[10.5px] text-faint">
                                {KIND_LABEL[p.kind]} · {p.readingMinutes} min
                                {p.tags.length > 0 && ` · ${p.tags.join(", ")}`}
                              </span>
                            </span>
                            {p.thumbnail && (
                              <img
                                src={p.thumbnail}
                                alt=""
                                loading="lazy"
                                className="shrink-0 mt-1 w-[84px] md:w-[120px] aspect-[4/3] rounded-md object-cover ring-1 ring-ink/[0.06] transition-opacity duration-300 group-hover:opacity-85"
                              />
                            )}
                          </span>
                          <span className="hidden md:flex items-center gap-1.5 text-[10.5px] text-faint whitespace-nowrap">
                            <span className="px-1.5 h-[16px] inline-flex items-center rounded-full bg-card">
                              {KIND_LABEL[p.kind]}
                            </span>
                            {p.readingMinutes} min
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                </ul>
              </section>
            ))}
            {visible.length === 0 && (
              <p className="text-[12px] text-mute">nothing here yet.</p>
            )}
          </div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
};

export default WritingIndex;
