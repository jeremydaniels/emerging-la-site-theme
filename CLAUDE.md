# Emerging LA

The website for Emerging LA, a newsletter and events organization for the LA tech ecosystem.
Static site. No accounts, no backend, no database.

`design-system.md` is the visual spec and it has the real numbers. This file is the working
brief. When the two disagree, `design-system.md` wins on anything visual.

---

## Stack

- **Astro 5**, static output, `trailingSlash: 'never'`, `build.format: 'file'`
- **Tailwind v4** via `@tailwindcss/vite`. No `tailwind.config.js`; the theme is CSS.
- **TypeScript**, `astro/tsconfigs/strict`
- **Zero client JS by default.** The build currently ships no framework and no JS bundle.

### Interactivity

Three places on this site need it, and only three:

1. the archive category filters
2. the events upcoming/past toggle
3. the subscribe form

They run on **scoped `<script>` tags inside the `.astro` component**, not framework islands. No UI
framework is installed. If one of these ever outgrows a plain script, add `@astrojs/preact` and
make only that component an island. Do not reach for a framework before then, and never add a
`client:*` directive to something that could be a script.

Check the cost of any change with `npm run build` and then `ls dist/_astro/`. A `.js` file
appearing there is a regression unless it was a deliberate decision.

---

## Palette

Set in exactly one file, `src/styles/tokens.css`. A palette swap is one edit in the PALETTE block
at the top of that file. **Nothing else in the codebase may contain a hex, rgb or hsl value.**

| | Light | Dark |
| --- | --- | --- |
| Ground | `#F5F0EB` | `#1C1C1C` |
| Paper | `#FFFDFA` | `#141311` |
| Ink | `#1C1C1C` | `#FFFDFA` |
| Ink muted | `rgba(28,28,28,0.60)` | `rgba(255,253,250,0.62)` |
| Rules | `rgba(28,28,28,0.14)` | `rgba(255,253,250,0.16)` |
| Accent dark | `#D9600E` | `#D9600E` |
| Accent core | `#FF6218` | `#FF6218` |
| Accent light | `#FF8426` | `#FF8426` |

Light and dark are both V1, driven **only** by `data-theme` on `<html>`.

**There is no `prefers-color-scheme` rule anywhere in this codebase and there must not be one.**
Light is the default for everyone, including a first-time visitor whose OS is set to dark. The
toggle in the nav is the only thing that ever changes the mode; the choice lives in `localStorage`
under `ela-theme`, and a 106 byte synchronous script at the top of `<head>` restores it before
first paint. If you add a `@media (prefers-color-scheme: …)` block, you have broken that. See
`design-system.md` §16.

### Rules about the orange

- Orange is **under roughly 10%** of what is on screen.
- **One anchor-orange element is live in the viewport at a time.** An anchor is a solid orange fill
  of real area. Hairlines and arrows are not anchors.
- **Light mode: orange is never body copy.** Measured against the cream ground, dark orange is
  3.29:1, core is 2.64:1, light is 2.16:1. Large text only, or a fill.
- **Dark mode: orange body copy is fine.** Against the dark ground it is 4.57, 5.69 and 6.96.
- Components use `--ela-accent-step`, which resolves to the right orange for the current mode.
  Do not reference `--ela-accent-dark` or `--ela-accent-light` directly.
- `--ela-ink-muted` is 4.30:1 on cream, which is under AA for small text. Muted paragraphs use
  `--ela-ink-muted-aa` (5.20:1). Metadata and mono labels can use the plain one.

## Type

- **Riegal** for display. Local file, `public/fonts/riegal.woff2`.
  **One static weight, no width axis.** Never set `font-weight` or `font-stretch` on it; the
  mockup's `800` and `78%` came from Archivo and do not port. `font-synthesis: none` is global.
- **Manrope** for body, from Google Fonts.
- **Courier Prime** for labels and metadata. This is the structural voice of the design, not
  decoration. Every eyebrow, label, table header, metadata bar and form label is mono, uppercase,
  and widely tracked.

Scales are Tailwind steps: `text-display-1` … `text-display-5`, `text-title-1`, `text-stat`,
`text-lead`, `text-body`, `text-ui`, `text-mono-eyebrow`, `text-mono-label`, and so on. Full table
in `design-system.md` §2.

## Logo

Wordmark only. **There is no emblem, icon or monogram anywhere on this site, including the
favicon.** The mockup pairs the wordmark with a small orange dot; that dot is not shipped.

Two files, `public/logo/wordmark-black.svg` and `wordmark-cream.svg`, both trimmed to the glyph
bounding box (aspect ratio 5.34:1). Use the `Wordmark` component, which picks the right one.

The wordmark never sits on a ground it disappears into: cream on Ground or Paper is forbidden,
black on Ink, Well or the orange band is forbidden. On a photo it needs a backing block or a scrim.

**Minimum width is 120px and that is a hard floor, not a target.** A previous build set a higher
minimum and clipped the mobile bar below 350px. The `Wordmark` component enforces the floor with
`max(120px, …)`. Do not raise it.

---

## Copy rules

These are absolute. They apply to page copy, data files, alt text, meta descriptions, button
labels and error messages.

1. **Never the word "free."** Not "free to attend", not "free newsletter". Rewrite around it:
   "anyone can attend", "no cost to attend", "open to anyone building here".
2. **No em dashes anywhere.** Not in copy, not in data files, not in comments that end up on the
   page. Use a period, a comma, or a rewrite. (The mockup is full of them. They do not carry over.)
3. **No invented statistics, names or dates.** If a number is not verified, it does not go on the
   page. The only real number is **14K+ community**. Do not invent issue counts, event counts,
   attendee counts, company counts, founder names or venue names.
4. **Never frame this as exclusive or members-only.** No "invite only", no "apply for access", no
   "the room you can't get into". The events are open. The newsletter is open. Say so plainly.

Tone: direct, concrete, unhyped. Short sentences. No manifesto voice.

---

## Where things live

```
design-system.md              Visual spec. Real values. Read it before styling anything.
CLAUDE.md                     This file.
README.md                     How to run it, and the events flag warning.

astro.config.mjs              Astro + the Tailwind vite plugin.
scripts/check-event-flags.mjs Build time warning for overdue event flags.

public/
  fonts/riegal.woff2          Display face, one weight.
  logo/wordmark-black.svg     Wordmark, for light grounds.
  logo/wordmark-cream.svg     Wordmark, for dark grounds and the orange band.
  favicon.svg                 The wordmark on a cream square. No emblem.

src/
  styles/tokens.css           THE ONLY FILE WITH A COLOUR IN IT. Palette, modes, @theme.
  styles/global.css           Font face, base styles, component classes (.btn, .card, .frame…).

  layouts/BaseLayout.astro    Document shell, head, fonts.
  layouts/SiteLayout.astro    Strip + nav + content + footer. Every route except the two below.
  layouts/FocusLayout.astro   Stripped chrome: centred wordmark, content, one line footer, no nav.
                              Used by /subscribe and /thanks only.

  components/Nav.astro        Sticky nav. Subscribe here is SECONDARY, not anchor orange.
  components/ThemeToggle.astro    The mode switch. Never orange. Nav + mobile menu.
  components/Footer.astro     Ink ground in both modes, via .on-ink.
  components/Wordmark.astro   Picks black or cream, enforces the 120px floor.
  components/SectionHeader.astro  Numbered eyebrow + H2 + rule.
  components/PhotoFrame.astro     Mat, well, warm multiply, corner crop marks, metadata bar.
  components/MetaBar.astro        Mono metadata bar.
  components/Stub.astro           Scaffolding marker. Delete as pages get written.

  data/issues.ts              Newsletter archive. Hand maintained, typed.
  data/events.ts              Events. Hand maintained, typed. STATUS IS A MANUAL FLAG.
  lib/links.ts                Every external URL. All placeholders right now.
  lib/site.ts                 Site constants and the nav link list.

  pages/                      index, about, archive, events, subscribe, thanks,
                              privacy, terms, 404. All stubs.
```

### Utility classes worth knowing

`.on-ink`, `.on-accent` and `.on-paper` re-point every token for a block sitting on a different
ground, so children keep using `text-ink` and `border-rule` and come out right. Reach for these
instead of hardcoding values on individual elements. Full table in `design-system.md` §15.

Note that `.on-accent` inverts what muted means: on orange, `ink` is cream and is for display sizes
only, while `ink-muted` and `ink-muted-aa` are near-black, because that is what is readable there.
A panel inside the orange band needs `.on-paper` or it comes out orange on orange.

`.t-display` is the display face uppercase (H1, H2, stats). `.t-title` is the display face in
sentence case, and it is what card headlines and table row titles use.

---

## Things that will bite you

- **Event status does not follow the date.** `status: 'upcoming' | 'past'` in `src/data/events.ts`
  is set by hand. A finished event stays in Upcoming until someone edits the file. The build prints
  a warning listing overdue ones; it does not fail.
- **All external links are placeholders.** Real Luma, LinkedIn and Beehiiv URLs land in
  `src/lib/links.ts` later. Nothing else should hardcode an external URL.
- **One breakpoint.** The design has exactly one, at 900px, exposed as the `wide:` variant. The
  mockup wrote it as `max-width: 900px` overrides; we write it as `wide:` min-width utilities.
  Do not add `sm:` `md:` `lg:`.
- **`vite` is pinned to `^6.4.3`** in devDependencies to match the copy Astro nests. Without the
  pin, `@tailwindcss/vite` pulls vite 8 and `astro check` fails on a plugin type mismatch.
