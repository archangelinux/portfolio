import React, { useState } from "react";
import ReactMarkdown, { Components, ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Check, Copy, Link as LinkIcon, Info, Lightbulb, TriangleAlert, Quote, KeyRound, StickyNote } from "lucide-react";
import remarkCallouts, { CalloutType, remarkCodeMeta } from "./remarkCallouts";

/* ————————————————————————————————————————————————————————————————————————
   helpers
   ———————————————————————————————————————————————————————————————————————— */

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");

interface HastNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  data?: { meta?: string };
}

const hastText = (n?: HastNode): string => {
  if (!n) return "";
  if (n.type === "text") return n.value ?? "";
  return (n.children ?? []).map(hastText).join("");
};

const reactText = (c: React.ReactNode): string => {
  if (c == null || typeof c === "boolean") return "";
  if (typeof c === "string" || typeof c === "number") return String(c);
  if (Array.isArray(c)) return c.map(reactText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(c)) return reactText(c.props.children);
  return "";
};

/** "September 3rd, 2026" · "Sep 3, 2026" · "2026-09-03" → journal date heading */
const DATE_HEADING =
  /^(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}|\d{4}-\d{2}-\d{2})$/i;

/* ————————————————————————————————————————————————————————————————————————
   headings — anchor on hover; date-shaped headings become journal markers
   ———————————————————————————————————————————————————————————————————————— */

const heading =
  (Tag: "h1" | "h2" | "h3" | "h4") =>
  ({ children, node, ...rest }: React.HTMLAttributes<HTMLHeadingElement> & ExtraProps) => {
    const text = reactText(children);
    const id = slugify(text);
    const isDate = DATE_HEADING.test(text.trim());
    void node;
    return (
      <Tag id={id} className={isDate ? "wr-date" : undefined} {...rest}>
        <a href={`#${id}`} className="wr-anchor" aria-label={`Link to ${text}`}>
          <LinkIcon />
        </a>
        {children}
      </Tag>
    );
  };

/* ————————————————————————————————————————————————————————————————————————
   callouts (from remarkCallouts) + regular blockquotes
   ———————————————————————————————————————————————————————————————————————— */

const CALLOUT_ICON: Record<CalloutType, React.ReactNode> = {
  note: <StickyNote />,
  info: <Info />,
  tip: <Lightbulb />,
  warning: <TriangleAlert />,
  quote: <Quote />,
  key: <KeyRound />,
};

const CALLOUT_LABEL: Record<CalloutType, string> = {
  note: "note",
  info: "info",
  tip: "tip",
  warning: "heads up",
  quote: "quote",
  key: "takeaway",
};

const Blockquote = ({
  children,
  node,
  ...rest
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement> & ExtraProps & { "data-callout"?: string; "data-title"?: string }) => {
  void node;
  const type = rest["data-callout"] as CalloutType | undefined;
  if (!type) return <blockquote {...rest}>{children}</blockquote>;
  const title = rest["data-title"];
  return (
    <aside className={`wr-callout wr-callout-${type}`}>
      <div className="wr-callout-head">
        <span className="wr-callout-icon">{CALLOUT_ICON[type]}</span>
        <span className="wr-callout-label">{title ?? CALLOUT_LABEL[type]}</span>
      </div>
      <div className="wr-callout-body">{children}</div>
    </aside>
  );
};

/* ————————————————————————————————————————————————————————————————————————
   code blocks — language / filename label + copy button
   ```ts title="server.ts"
   ———————————————————————————————————————————————————————————————————————— */

const Pre = ({ children, node }: React.HTMLAttributes<HTMLPreElement> & ExtraProps) => {
  const [copied, setCopied] = useState(false);
  const codeNode = (node as HastNode | undefined)?.children?.find((c) => c.tagName === "code");
  const classes = ((codeNode?.properties?.className as string[] | undefined) ?? []).join(" ");
  const lang = classes.match(/language-([\w+-]+)/)?.[1];
  const props = codeNode?.properties ?? {};
  const meta = String(props.dataMeta ?? props["data-meta"] ?? codeNode?.data?.meta ?? "");
  const title = meta.match(/(?:title|filename)=["']([^"']+)["']/)?.[1];
  const raw = hastText(codeNode);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <figure className="wr-code">
      <figcaption className="wr-code-head">
        <span className="wr-code-title">{title ?? lang ?? "text"}</span>
        {title && lang && <span className="wr-code-lang">{lang}</span>}
        <button type="button" onClick={copy} className="wr-code-copy" aria-label="Copy code">
          {copied ? <Check /> : <Copy />}
          <span>{copied ? "copied" : "copy"}</span>
        </button>
      </figcaption>
      <pre>{children}</pre>
    </figure>
  );
};

/* ————————————————————————————————————————————————————————————————————————
   misc
   ———————————————————————————————————————————————————————————————————————— */

const Anchor = ({ href = "", children, node, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) => {
  void node;
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...rest} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
};

const Table = ({ children, node, ...rest }: React.TableHTMLAttributes<HTMLTableElement> & ExtraProps) => {
  void node;
  return (
    <div className="wr-table">
      <table {...rest}>{children}</table>
    </div>
  );
};

const Img = ({ src, alt, title, node, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & ExtraProps) => {
  void node;
  return (
    <figure className="wr-figure">
      <img src={src} alt={alt ?? ""} loading="lazy" {...rest} />
      {(title ?? alt) && <figcaption>{title ?? alt}</figcaption>}
    </figure>
  );
};

const components: Components = {
  h1: heading("h1"),
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  blockquote: Blockquote,
  pre: Pre,
  a: Anchor,
  table: Table,
  img: Img,
};

const Markdown: React.FC<{ source: string }> = ({ source }) => (
  <div className="wr-prose">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkCallouts, remarkCodeMeta]}
      rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: false }]]}
      components={components}
    >
      {source}
    </ReactMarkdown>
  </div>
);

export default Markdown;
