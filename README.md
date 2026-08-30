# Emerging LA

The website for Emerging LA, a newsletter and events organization for the LA tech ecosystem.

Static site built with Astro and Tailwind. There is no backend, no database and no accounts.
The newsletter runs on Beehiiv and the events run on Luma; this site links out to both.

---

## Running it

Requires Node 20.19 or newer (Node 22 recommended, since the event flag check uses Node's built in
TypeScript support).

```bash
npm install
npm run dev          # http://localhost:4321
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Checks event flags, type checks, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run check` | Type check only |
| `npm run check:events` | Event flag check on its own, exits non-zero if anything is overdue |

The build output in `dist/` is plain static files. Any static host will serve it.

---

## ⚠️ Events: the upcoming/past flag is manual

**`status` in `src/data/events.ts` is set by hand. It is not derived from the date.**

An event does not move itself from Upcoming to Past when its date passes. After an event happens,
somebody has to:

1. open `src/data/events.ts`
2. change that event's `status: 'upcoming'` to `status: 'past'`
3. commit and deploy

**Until that happens, the site keeps showing a finished event as upcoming.**

This is deliberate. It keeps an event on the page while photos and a recap are still being put
together, and it means a postponed event does not silently disappear. The cost is that it is a
manual step and it is easy to forget.

`npm run build` prints a warning listing any event still flagged `upcoming` whose date has passed:

```
[events] 2 event(s) are still flagged "upcoming" but the date has passed.
[events] Open src/data/events.ts and change status to "past":

  · 2026-03-04  founders-dinner-march  (Founders dinner)
  · 2026-03-19  investor-mixer-spring  (Investor mixer)
```

The warning does not fail the build. Run `npm run check:events` if you want it to.

---

## Editing content

Everything on this site is hand maintained in typed files. Nothing is pulled from an API.

| What | Where |
| --- | --- |
| Newsletter archive | `src/data/issues.ts` (newest first) |
| Events | `src/data/events.ts` (remember the flag) |
| External links: Luma, LinkedIn, Beehiiv, socials, email | `src/lib/links.ts` |
| Site name, description, nav links | `src/lib/site.ts` |
| Colours | `src/styles/tokens.css`, PALETTE block at the top, and nowhere else |

All the external URLs in `src/lib/links.ts` are placeholders right now. The real Luma, LinkedIn and
Beehiiv links go in there when they are ready, and nothing else in the codebase should hardcode an
external URL.

---

## Copy rules

Anyone writing text for this site, in a page or in a data file, follows these:

1. Never the word "free."
2. No em dashes anywhere.
3. No invented statistics, names or dates. The only real number is 15K+ community.
4. Never frame this as exclusive or members-only.

---

## Design

`design-system.md` at the repo root is the visual spec, extracted from the homepage mockup in
`design/source/`. It has the actual values: type scale, spacing rhythm, the photo frame and its
corner crop marks, the mono metadata bars, numbered section headers, the ruled table, cards,
buttons, rule weights, how the orange is deployed, and the logo placement rules.

Read it before changing anything visual.

### Light and dark

Both modes are live, and the switch in the nav is the only thing that changes them.

- **Light is what everybody sees first**, including someone arriving on a phone set to dark. The
  site does not read `prefers-color-scheme` at all, on purpose.
- Once somebody flips the switch, the choice sticks across pages and return visits, in
  `localStorage` under `ela-theme`.
- A short synchronous script at the top of `<head>` applies the stored choice before first paint,
  so there is no flash of the wrong mode. It has to stay first in the head and it has to stay
  synchronous.
- Do not add a `@media (prefers-color-scheme: …)` block anywhere. It would fight all of the above.

### Notes for whoever styles the next page

- Both light and dark mode are live. Check both.
- Tokens live in one file. If you are about to type a hex value, you are in the wrong file.
- Zero client JS is the default and the build currently ships none. Interactivity is limited to the
  archive filters, the events toggle and the subscribe form, and all three use a scoped `<script>`
  rather than a framework island.

---

## Photos

There are no photographs on the site yet. Every photo slot renders the full frame treatment at the
aspect ratio it will ship at, with a dashed box, a cross and the path its file goes at printed
inside it. Nothing reflows when the real files land.

To fill one, put the file under `public/` at the path the slot prints, then set the value it names:

| Slot | Set this |
| --- | --- |
| Home hero | `src` in `src/data/photos.ts` |
| Issue card | `image` on that row in `src/data/issues.ts` |
| Event row | `image` on that row in `src/data/events.ts` |

One edit per slot. Set `imageAlt` at the same time.

## Placeholder content

The home page renders placeholder issues and events so the sections have something in them. They
are marked `placeholder: true` in `src/data/issues.ts` and `src/data/events.ts`, and their names
are bracketed on purpose so nobody quotes them back as real.

```bash
grep -rn "placeholder: true" src/data/    # every placeholder row
```

Delete them as real content arrives. The only number stated as fact anywhere is 15K+ community;
the other three cells in the proof strip read `[TBD]` until somebody verifies them.

## Current state

The home page is built. The other eight routes are still stubs showing a dashed block describing
what belongs there.

Routes: `/`, `/about`, `/archive`, `/events`, `/subscribe`, `/thanks`, `/privacy`, `/terms`, `404`.

`/subscribe` and `/thanks` use `FocusLayout`: no nav, no footer columns, just a centred wordmark
and a one line footer.

`EventsTable` already takes a variant, so the events page can render past events from the same
component: `<EventsTable events={pastEvents()} variant="past" />`.
