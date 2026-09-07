/**
 * Turns GitHub-style alert blockquotes into Confluence-style panels:
 *
 * > [!NOTE] Optional title
 * > Body of the panel, any markdown.
 *
 * Types: NOTE · TIP · INFO · WARNING · QUOTE · KEY (takeaway).
 * The marker is stripped and the blockquote gets `data-callout` / `data-title`
 * props, which `Markdown.tsx` renders as a panel.
 */

interface Node {
  type: string;
  value?: string;
  meta?: string | null;
  children?: Node[];
  data?: { hProperties?: Record<string, string> };
}

export const CALLOUT_TYPES = ["note", "tip", "info", "warning", "quote", "key"] as const;
export type CalloutType = (typeof CALLOUT_TYPES)[number];

const MARKER = /^\[!([A-Za-z]+)\]\s*([^\n]*)\n?/;

const walk = (node: Node, fn: (n: Node) => void) => {
  fn(node);
  node.children?.forEach((c) => walk(c, fn));
};

export default function remarkCallouts() {
  return (tree: Node) => {
    walk(tree, (node) => {
      if (node.type !== "blockquote" || !node.children?.length) return;
      const para = node.children[0];
      if (para.type !== "paragraph" || !para.children?.length) return;
      const text = para.children[0];
      if (text.type !== "text" || typeof text.value !== "string") return;
      const m = text.value.match(MARKER);
      if (!m) return;
      const type = m[1].toLowerCase();
      if (!(CALLOUT_TYPES as readonly string[]).includes(type)) return;

      text.value = text.value.slice(m[0].length);
      if (!text.value) para.children.shift();
      if (!para.children.length) node.children.shift();

      node.data = node.data ?? {};
      node.data.hProperties = {
        ...node.data.hProperties,
        "data-callout": type,
        ...(m[2].trim() ? { "data-title": m[2].trim() } : {}),
      };
    });
  };
}

/**
 * Copies a fenced code block's info-string meta (```ts title="x.ts") onto the
 * element as `data-meta`, since rehype-raw drops mdast `data` but keeps
 * attributes. `Markdown.tsx` reads it back for the code-block header.
 */
export function remarkCodeMeta() {
  return (tree: Node) => {
    walk(tree, (node) => {
      if (node.type !== "code" || !node.meta) return;
      node.data = node.data ?? {};
      node.data.hProperties = { ...node.data.hProperties, "data-meta": node.meta };
    });
  };
}
