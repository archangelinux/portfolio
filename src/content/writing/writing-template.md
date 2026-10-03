---
title: How to write a post here
description: A living style sheet for this section. Every block you can use, and the markdown that produces it.
date: 2026-09-06
tags: [meta, template]
kind: note
draft: true
---

A post is one markdown file in `src/content/writing/`. The filename is the URL, the block at the top is the metadata, and everything below it is the post. Nothing else to register. This page is marked `draft: true`, so it only shows up in `npm run dev`.

> [!TIP] the whole workflow
> 1. copy this file, rename it to whatever you want the URL to be
> 2. edit the frontmatter (title, date, tags, kind)
> 3. write
> 4. `git push`

## Frontmatter

```yaml title="src/content/writing/my-post.md"
---
title: Finance in practice
description: One or two sentences. Shown on the index and under the title.
date: 2026-09-03            # ordering + display
updated: 2026-09-05         # optional
tags: [finance, co-op]      # optional
kind: essay                 # essay | note  (default: note)
thumbnail: my-post.png      # optional; file in src/assets
draft: true                 # optional; hidden in production
---
```

## Text

Body text is set in a serif; headings, labels and code are in the site's mono. **Bold**, _italics_, `inline code`, [links](https://wealthsimple.com), and footnotes[^1] all work. Keyboard keys: <kbd>⌘</kbd> <kbd>K</kbd>. ~~Strikethrough~~ too.

A second paragraph, to show spacing. Lists:

- unordered, with the site's pill-coloured bullet
- nesting works
  - like this
- and task lists
  - [x] done
  - [ ] not yet

1. ordered lists
2. use mono numerals
3. in the gutter

## Headings & the table of contents

Any `##` or `###` heading appears in the sticky "on this page" rail on wide screens, and gets a hover-anchor so you can link straight to it.

### Journal date markers

A heading that _is_ a date becomes a timeline marker instead of a title. Write `## September 3rd, 2026` (or `## Sep 3, 2026`, or `## 2026-09-03`) and you get the dot-and-rule treatment used in the finance journal:

## September 6th, 2026

Like that. Everything under it reads as an entry until the next date.

## Panels

GitHub's alert syntax, restyled as Confluence panels. Put an optional title after the marker.

```md
> [!NOTE] optional title
> Body of the panel. Any markdown, multiple paragraphs, lists…
```

> [!NOTE]
> A neutral aside. Default label is "note".

> [!INFO] bear market
> A titled info panel. Good for definitions.

> [!TIP]
> Something that saved you time.

> [!WARNING] gotcha
> Something that cost you time.

> [!KEY]
> The one-line takeaway. Gold, because it's the thing worth remembering.

> [!QUOTE] on emotion
> "Far more money has been lost by investors preparing for corrections than has been lost in corrections themselves."
>
> **Peter Lynch**

A plain blockquote (no marker) is a pull quote:

> It's as traceable as recurrence relations, but disorienting in a way recursion never is.

## Code

Fenced code blocks get a language label and a copy button. Add `title="…"` after the language to show a filename instead.

```ts title="src/writing/posts.ts"
const raw = import.meta.glob<string>("../content/writing/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const posts: Post[] = Object.entries(raw)
  .map(([path, src]) => toPost(path, src))
  .filter((p) => import.meta.env.DEV || !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));
```

```python
def closing_balance(opening: float, entries: list[float]) -> float:
    """The opening balance calls back to the last closing one."""
    return opening + sum(entries)
```

```sql
select account_id, sum(amount) as balance
from ledger
where posted_at < date '2026-09-01'
group by account_id;
```

```bash
npm run dev
```

## Tables

Pipe tables. Header row is mono-uppercase; wide tables scroll sideways rather than breaking the page.

| Phase | What's happening | Returns |
| --- | --- | --- |
| Despair | Investors anticipate recession; valuations fall sharply. | Negative |
| Hope | Recovery is anticipated before profits bottom out. | Strong |
| Growth | Earnings catch up to valuation. | Modest, steady |
| Optimism | Expectations outrun what companies can deliver. | High, then… |

## Images

Put files in `public/writing/` and reference them with an absolute path. The `title` (in quotes) becomes the caption.

```md
![alt text](/writing/chart.png "Caption goes here")
```

## Dividers & collapsibles

Three dashes make a short centred rule:

---

Native `<details>` works for long tangents:

<details>
<summary>appendix: why not MDX?</summary>

MDX lets you embed React components in a post, but it means every post is code. Plain markdown with a few conventions covers ~all of it and stays editable from a phone.

</details>

[^1]: Footnotes collect at the bottom, like this.
