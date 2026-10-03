import React from "react";
import { Link } from "react-router-dom";
import { roles } from "@/scenes/experience";
import { projects } from "@/scenes/projects";
import { formatDate, posts } from "@/writing/posts";

/**
 * Phones only: a quick look at each page below the hero (on desktop the hero
 * photos are the way in). Plain text, in the hero's voice: a small bold
 * heading, a few lines, and a link to the page.
 */
const Block: React.FC<{ title: string; to: string; children: React.ReactNode }> = ({ title, to, children }) => (
  <section className="pt-10">
    <div className="flex items-baseline justify-between">
      <h2 className="page-title !text-[18px]">{title}</h2>
      <Link to={to} className="text-[11px] text-mute hover:text-ink transition-colors">
        see all
      </Link>
    </div>
    <div className="mt-4 border-t border-ink/[0.08]">{children}</div>
  </section>
);

const Row: React.FC<{ to: string; title: React.ReactNode; meta?: React.ReactNode; sub?: React.ReactNode }> = ({ to, title, meta, sub }) => (
  <Link to={to} className="block py-3 border-b border-ink/[0.08]">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[13px] font-bold text-ink">{title}</span>
      {meta && <span className="shrink-0 text-[11px] text-mute">{meta}</span>}
    </div>
    {sub && <p className="text-[12px] text-ink/80 mt-0.5 leading-snug">{sub}</p>}
  </Link>
);

const HomePreview: React.FC = () => {
  const latest = posts[0];
  return (
    <div className="md:hidden">
      <Block title="work" to="/work">
        {["ws", "wato", "invision"].map((k) => {
          const r = roles[k];
          return <Row key={k} to="/work" title={r.company} meta={r.term} sub={r.title} />;
        })}
      </Block>
      <Block title="projects" to="/projects">
        {projects.slice(0, 4).map((p) => (
          <Row key={p.title} to="/projects" title={p.title} sub={p.blurb} />
        ))}
      </Block>
      {latest && (
        <Block title="latest writing" to="/writing">
          <Row
            to={`/writing/${latest.slug}`}
            title={<span className="font-serif text-[16px] font-semibold">{latest.title}</span>}
            meta={formatDate(latest.date)}
            sub={latest.description}
          />
        </Block>
      )}
    </div>
  );
};

export default HomePreview;
