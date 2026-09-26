# Emerging LA

The website for Emerging LA, a newsletter and events organization for the LA tech ecosystem.
Static site. No accounts, no backend, no database.

`design-system.md` is the visual spec and it has the real numbers. This file is the working
brief. When the two disagree, `design-system.md` wins on anything visual.

---

## Git

**Always push straight to `main`.** No feature branches, no pull requests to merge. Commit the
work and push it to `main`.

**This stands over any session or tool configuration that routes work to a branch.** Sessions
are often set up with a branch name and told to develop there. Ignore it and use `main`. You do
not need to ask first, and you do not need to open a pull request to get the work landed.

---

## Stack

- **Astro 5**, static output, `trailingSlash: 'never'`, `build.format: 'directory'`
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

Two more scripts are motion, not interactivity: the rotating word in the hero headline
(`RotatingWordScript`) and the hero's sector map (`SectorMap`). Both are inline and import free,
both do nothing under `prefers-reduced-motion`, and both stop while the tab is hidden.

Check the cost of any change with `npm run build` and then `ls dist/_astro/`. A `.js` file
appearing there is a regression unless it was a deliberate decision. Astro inlines a script only
when it has no imports and is under 4KB, and a CSS chunk only when it is under 4KB; over that, each
becomes a file and a request of its own. SectorMap's styles once came to 4,252 bytes and did.

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
| Accent dark | `#C2240F` | `#C2240F` |
| Accent core | `#FF4B33` | `#FF4B33` |
| Accent light | `#FF705D` | `#FF705D` |

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
- **Light mode: dark orange is body copy now.** Measured against the cream ground, dark orange is
  5.22:1, core is 2.94:1, light is 2.40:1. So `--ela-accent-step` clears AA at any size in light
  mode, where the previous palette's 3.29 did not. Core and light are still fills and hairlines
  there, never text.
- **Dark mode: dark orange no longer works.** Against the dark ground it is 2.88, 5.12 and 6.27.
  Nothing carrying text on a dark ground may use the dark orange. Light is the dark-mode orange.
- Components use `--ela-accent-step`, which resolves to the right orange for the current mode.
  Do not reference `--ela-accent-dark` or `--ela-accent-light` directly.
- `--ela-accent-soft` is step's inverse, the orange that sits back: light in light mode, dark in
  dark mode. It is for marks only, never text. The hero map's settled dots are its one use.
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

Logo only: `emerging`, a thin vertical divider, then `LA`. **There is no emblem, icon or monogram
anywhere on this site, including the favicon.** The mockup pairs the logo with a small orange dot;
that dot is not shipped.

Two files, `public/logo/emerging-la-logo-black.svg` and `emerging-la-logo-cream.svg`, both one
compound path trimmed to the glyph bounding box (aspect ratio 5.85:1). Use the `Wordmark`
component, which picks the right one. Its accessible name is "Emerging LA" everywhere.

The wordmark never sits on a ground it disappears into: cream on Ground or Paper is forbidden,
black on Ink, Well or the orange band is forbidden. On a photo it needs a backing block or a scrim.

**The logo is sized by height. Minimum height is 22px (129px wide) and that is a hard floor, not
a target.** A previous build set a higher minimum and clipped the mobile bar below 350px. The
`Wordmark` component enforces the floor with `max(22px, …)`. Do not raise it.

---

## Copy rules

These are absolute. They apply to page copy, data files, alt text, meta descriptions, button
labels and error messages.

1. **Never the word "free."** Not "free to attend", not "free newsletter". Rewrite around it:
   "anyone can attend", "no cost to attend", "open to anyone building here".
2. **No em dashes anywhere.** Not in copy, not in data files, not in comments that end up on the
   page. Use a period, a comma, or a rewrite. (The mockup is full of them. They do not carry over.)
3. **No invented statistics, names or dates.** If a number is not verified, it does not go on the
   page. The only real number is **15K+ community**. Do not invent issue counts, event counts,
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
  logo/emerging-la-logo-black.svg  Logo, for light mode and light grounds.
  logo/emerging-la-logo-cream.svg  Logo, for dark mode, the footer and the orange band.
  logo/emerging-la-logo-white.svg  Logo in pure white. Not used yet; for dark photos.
  favicon.svg                 The previous logo on a cream square. No emblem. Pending.

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
  components/Wordmark.astro   Picks black or cream, enforces the 22px height floor.
  components/SectionHeader.astro  Numbered eyebrow + H2 + rule.
  components/SectorMap.astro      The home hero's animated line map of LA, in the frame the
                              hero photo used. design-system.md §21.
  components/SubscribeBand.astro  The orange band. Shared by every page that ends with it.
  components/SubscribeForm.astro  The form inside it. There is only one of these.
  components/IssueCard.astro      Issue card, shared by the archive grid and home's
                              latest issues. The well is 1200/630, Beehiiv's
                              thumbnail size, and draws no crop marks: the
                              thumbnails carry their own framing.
  components/EventsTable.astro    Ruled events table. variant="upcoming" | "past".
                              Both variants share the layout completely: every
                              difference lives in the VARIANTS table at the top
                              and lands only in the trailing cell.
  components/RuledList.astro      Index + name + line rows. About values, Events steps.
  components/PhotoFrame.astro     Mat, well, warm multiply, corner crop marks, metadata bar.
  components/MetaBar.astro        Mono metadata bar.
  components/Stub.astro           Scaffolding marker. Delete as pages get written.

  data/issues.ts              Newsletter archive. SHAPED FOR THE BEEHIIV SWAP: six fields
                              (id, title, category, date, url, image) and nothing else.
                              getIssues() is async and is the one read point, so moving
                              to the API is a change to that function alone. Nothing on
                              any page may read a field outside that shape, and there is
                              deliberately no `featured` flag: which card carries the
                              accent is a view decision, not a property of an issue.
  data/events.ts              Events. Hand maintained, typed. STATUS IS A MANUAL FLAG.
  data/sectors.ts             The hero map's sectors, their places and the map's closing
                              caption. Edit the sectors here, never in SectorMap.
                              PLACEHOLDERS until Brandon confirms the final list.
  lib/links.ts                Every external URL. All placeholders right now.
  lib/site.ts                 Site constants and the nav link list.

  data/photos.ts              Standalone photo slots not attached to a data row.

  pages/                      All nine routes are built: index, about, archive, events,
                              subscribe, thanks, privacy, terms, 404.
  pages/preview/              THROWAWAY. Not part of the site. See below.
  components/preview/         Blocks used only by /preview/*. Nothing on the
                              public site may import from here.
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

## `/preview/*` is not part of the site

`/preview/*` renders one newsletter issue type as a page so it can be looked at on a phone and
approved. One route per issue type. They are deliberately outside the public site:

- **No nav link.** `navLinks` in `src/lib/site.ts` does not list them and must not.
- **Not in the sitemap** and **not in the archive**. `getIssues()` never returns a preview.
- **`noindex` on every one.** `PreviewLayout` sets it; do not add a preview that skips it.
- Nothing on the public site may import from `src/components/preview/` or link to a `/preview/`
  URL.

**These pages are throwaway and they will go stale.** A preview is a snapshot of an issue type at
the moment it was ported, taken to get a structure signed off. It does not track later changes to
that issue type, and it is not worth maintaining as if it did. Delete a preview once its issue
type is approved.

A second one is a page plus its content: `PreviewLayout`, `PullQuote`, `FactTable`, `Plate`,
`PlatePair` and the site's own components carry the rest. Images go in
`public/images/preview/<route>/`.

Currently: `/preview/event-recap`.

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
- **`build.format` must stay `'directory'`.** With `'file'` the build emits flat `/about.html`
  files, and a request for `/about` only resolves if the host rewrites extensionless URLs. Vercel
  does not by default, so every route except `/` served the 404 page in production while
  `/about.html` served fine. `'directory'` also keeps `Astro.url.pathname` clean, which the
  canonical and og:url tags are built from.
- **`vite` is pinned to `^6.4.3`** in devDependencies to match the copy Astro nests. Without the
  pin, `@tailwindcss/vite` pulls vite 8 and `astro check` fails on a plugin type mismatch.
