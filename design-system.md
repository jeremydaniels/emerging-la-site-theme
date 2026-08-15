# Emerging LA design system

Extracted from `design/source/Emerging LA homepage mockup.zip` → `Emerging LA Homepage v2.dc.html`,
which is the visual source of truth for the whole site.

Every value below is the literal value from the mockup unless a row is marked **PORT** (a value
that had to change because the mockup ran on Archivo and we ship Riegal) or **ADDED** (a value the
mockup did not have but the site needs, mostly dark mode).

Tokens live in exactly one file: `src/styles/tokens.css`. A palette swap is one edit there.

---

## 1. Palette

| Role | Token | Light | Dark |
| --- | --- | --- | --- |
| Ground (page) | `--ela-ground` | `#F5F0EB` | `#1C1C1C` |
| Paper (raised surface) | `--ela-paper` | `#FFFDFA` | `#141311` |
| Well (image/well backing) | `--ela-well` | `#15130F` | `#0F0E0C` |
| Ink (body) | `--ela-ink` | `#1C1C1C` | `#FFFDFA` |
| Ink muted | `--ela-ink-muted` | `rgba(28,28,28,0.60)` | `rgba(255,253,250,0.62)` |
| Ink faint (metadata) | `--ela-ink-faint` | `rgba(28,28,28,0.30)` | `rgba(255,253,250,0.55)` |
| Rule | `--ela-rule` | `rgba(28,28,28,0.14)` | `rgba(255,253,250,0.16)` |
| Hairline (inner rows) | `--ela-hairline` | `rgba(28,28,28,0.08)` | `rgba(255,253,250,0.10)` |
| Edge (form borders) | `--ela-edge` | `rgba(28,28,28,0.20)` | `rgba(255,253,250,0.24)` |
| Accent dark | `--ela-accent-dark` | `#D9600E` | `#D9600E` |
| Accent core | `--ela-accent` | `#FF6218` | `#FF6218` |
| Accent light | `--ela-accent-light` | `#FF8426` | `#FF8426` |

The dark ground is Ink itself (`#1C1C1C`). That is not a coincidence: it is the ground the supplied
contrast measurements were taken against, confirmed by calculation.

### Measured contrast, and the rules that follow from it

| Orange | on Ground `#F5F0EB` | on Dark ground `#1C1C1C` |
| --- | --- | --- |
| Accent dark `#D9600E` | **3.29:1** | **4.57:1** |
| Accent core `#FF6218` | **2.64:1** | **5.69:1** |
| Accent light `#FF8426` | **2.16:1** | **6.96:1** |

Rules, non-negotiable:

- **Light mode: orange is never body copy.** 3.29 clears AA-large only (≥24px, or ≥18.66px bold).
  Orange in light mode is for: section eyebrows, rules, small caps labels sitting next to a
  non-orange label of the same meaning, and **fills** (orange background + `#FFFDFA` text).
- Light mode small text that must be readable is `--ela-ink` or `--ela-ink-muted`, never orange.
- **Dark mode: orange body copy is fine.** All three clear AA at any size. Accent light `#FF8426`
  is the default orange on dark, which is why the mockup's dark blocks use `#FF8426` and its light
  blocks use `#D9600E`.
- On an orange fill (`#FF6218`), text is `#FFFDFA` — 3.32:1, so **fill text is large or bold only**,
  which is how the mockup uses it (buttons at 15px/700, mono chips at 10px uppercase are decorative
  labels backed by an adjacent text equivalent).

### Muted ink and AA

`rgba(28,28,28,0.60)` over the cream ground measures **4.30:1**. That clears AA-large but sits just
under the 4.5:1 needed for small body copy. Two tokens exist for this:

- `--ela-ink-muted` = `rgba(28,28,28,0.60)` — 4.30:1. Metadata, mono labels, eyebrows, captions.
- `--ela-ink-muted-aa` = `rgba(28,28,28,0.66)` — **5.20:1**. Any muted paragraph of real body copy.

In dark mode both resolve to `rgba(255,253,250,0.62)` (7.14:1), which passes either way.

### The 10% rule

Orange stays under roughly 10% of what is on screen, and **exactly one anchor-orange element is
live in the viewport at a time**. An anchor is a solid orange fill of meaningful area: the Subscribe
button, an orange section band, a category chip on a card. Hairline orange (a 26px eyebrow rule,
a 2px left border, a `→` glyph) is not an anchor and does not count against the one-at-a-time rule.

Practically, in the mockup: the nav Subscribe button is the anchor at the top, it scrolls away
before the orange subscribe band arrives, and no card row shows two orange chips at once.

---

## 2. Type

Three faces, three jobs. Nothing else.

| Role | Face | Source |
| --- | --- | --- |
| Display | **Riegal** | local, `public/fonts/riegal.woff2` |
| Body | **Manrope** | Google Fonts, weights 400 / 500 / 600 / 700 / 800 |
| Mono (labels, metadata) | **Courier Prime** | Google Fonts, weights 400 / 700 |

Courier Prime is what the mockup uses for every label, eyebrow, metadata bar, table header and
form label. It is 42 of the 59 font declarations in the file. It is not decoration, it is the
structural voice of the design.

### PORT: Riegal replaces Archivo

The mockup's display face is Archivo at `font-weight:800` with `font-stretch` between 74% and 88%.
**Riegal ships one static weight (400), normal width, no variable axes.** So:

- `font-weight` and `font-stretch` do not carry over. Drop them from every display rule.
- `font-synthesis: none` is set globally. Never fake-bold Riegal; it destroys the face.
- Display hierarchy is carried by **size, letter-spacing, line-height and uppercase**, which is
  where most of it lived in the mockup anyway.
- Riegal metrics: 1000 upm, cap height 688, x-height 545, ascender 819, descender -181.
  The high x-height means the tight line-heights below (0.86–0.95) still work.

Riegal is uppercase-and-lowercase complete (472 glyphs).

**Uppercase is not universal on the display face.** The mockup sets
`text-transform: uppercase` on H1 and H2 (and the stat numbers and date numerals) but **not** on
card headlines or table row titles, which stay sentence case. That distinction is load bearing: a
headline like "Inside the build with a $14M co-founder" is unreadable shouted. Two classes carry
it, `.t-display` (uppercase) and `.t-title` (sentence case, for the `title-1` and `title-2` steps).

`.t-title` also carries **statements** at `display-5`: the mission and vision lines on About. A
statement is a sentence, not a heading, and sixteen words of uppercase Riegal at 46px is a wall.
Rule of thumb: if it is a sentence somebody would read aloud, it is `.t-title`.

### Display scale (Riegal, uppercase, tight tracking)

| Step | Size | Line height | Tracking | Where |
| --- | --- | --- | --- | --- |
| `display-1` | `clamp(46px, 8.4vw, 124px)` | `0.86` | `-0.03em` | H1, homepage hero |
| `display-2` | `clamp(38px, 6.4vw, 92px)` | `0.87` | `-0.028em` | Subscribe band headline |
| `display-3` | `clamp(30px, 4.2vw, 54px)` | `0.90` | `-0.025em` | Footer wordmark line |
| `display-4` | `clamp(28px, 3.6vw, 52px)` | `0.95` | `-0.022em` | About statement |
| `display-5` | `clamp(26px, 3.4vw, 46px)` | `0.95` | `-0.02em` | Section H2 |
| `stat` | `clamp(34px, 4vw, 52px)` | `1` | `-0.02em` | Proof strip numbers |
| `title-1` | `clamp(19px, 1.7vw, 23px)` | `1.15` | `-0.008em` | Card headline |
| `title-2` | `clamp(18px, 1.8vw, 24px)` | `1.15` | `-0.008em` | Table row title |
| `day` | `26px` | `1` | `-0.02em` | Date block day number |
| `wordmark` | `19px` | `1` | `0.01em` | Nav wordmark (text fallback) |

### Body scale (Manrope)

| Step | Size | Weight | Line height | Where |
| --- | --- | --- | --- | --- |
| `lead` | `clamp(16px, 1.3vw, 19px)` | 500 | `1.5` | Hero paragraph |
| `lead-alt` | `clamp(16px, 1.4vw, 20px)` | 400 | `1.5` | Subscribe band paragraph |
| `body-lg` | `clamp(16px, 1.35vw, 19px)` | 400 | `1.55` | About, first paragraph |
| `body` | `16px` | 400 | `1.6` | Default paragraph |
| `body-sm` | `15px` | 400 | `1.55` | Footer blurb, card body |
| `ui` | `14.5px` | 700 | `1` | Buttons, footer links |
| `ui-sm` | `14px` | 600 | `1` | Nav links |
| `note` | `14px` | 400 | `1.45` | Table row note |
| `micro` | `13.5px` | 600 | `1.35` | Teaser list item |

Body copy never goes below `13.5px`. Mono labels do; that is what mono is for.

### Mono scale (Courier Prime, uppercase, wide tracking)

| Step | Size | Tracking | Where |
| --- | --- | --- | --- |
| `mono-eyebrow` | `11px` | `0.16em` | Numbered section eyebrow |
| `mono-label` | `10px` | `0.16em` | Form labels, card chips |
| `mono-label-wide` | `10px` | `0.18em` | Table column headers |
| `mono-footer-head` | `10px` | `0.20em` | Footer column headings |
| `mono-meta` | `10.5px` | `0.13em` – `0.16em` | Photo metadata bar, top bar, footer legal |
| `mono-meta-lg` | `11.5px` | `0.10em` – `0.12em` | Hero cadence note, location cell |
| `mono-tab` | `11px` | `0.14em` | Events upcoming/past tabs |
| `mono-role` | `12px` | `0.12em` | Subscribe role chips |
| `mono-input` | `17px` | `0` | Email input value |

Every mono step is `text-transform: uppercase` except `mono-input`.

Tracking ladder, memorise it: **`0.10 → 0.12 → 0.13 → 0.14 → 0.16 → 0.18 → 0.20`**. The smaller the
type, the wider the tracking. `0.16em` is the workhorse (18 of 47 uses).

---

## 3. Spacing rhythm

Base unit is **2px**, and the mockup is comfortable with half-steps (`10.5px`, `14.5px`, `1.5px`).
Do not round these to a 4px or 8px grid; the half-steps are load-bearing on the mono bars.

### Page frame

| Thing | Value |
| --- | --- |
| Content max width | `1360px` |
| Page gutter, desktop | `30px` |
| Page gutter, ≤900px | `18px` |
| Top strip height | `7px` vertical padding |
| Sticky nav height | `60px` |

### Section rhythm

| Thing | Value |
| --- | --- |
| Section top padding, desktop | `82px` (standard) · `88px` (About, Subscribe band offset) |
| Section top padding, ≤900px | `54px` |
| Hero block | `52px 0 34px` |
| Section header → content | `34px` (with rule) · `12px` (when a filter row follows) |
| Eyebrow → H2 | `12px` (in header) · `18px`–`22px` (standalone) |
| H2 → body paragraph | `26px`–`30px` |
| Body → button row | `30px` |
| Grid gap, cards | `26px` |
| Grid gap, two-column prose | `56px` |
| Grid gap, hero | `36px` |
| Grid gap, ≤900px (all) | `16px` |
| Footer top / bottom | `58px` / `34px` |

The `@media (max-width: 900px)` breakpoint is the only one in the mockup. One breakpoint. Keep it.

---

## 4. Rules and borders

Four weights, and that is the whole vocabulary:

| Weight | Colour | Use |
| --- | --- | --- |
| `1px` | `--ela-rule` `rgba(28,28,28,0.14)` | Section headers, card borders, table headers, grid dividers, nav bottom |
| `1px` | `--ela-hairline` `rgba(28,28,28,0.08)` | Rows *inside* a list or table, card inner divider |
| `1.5px` | `--ela-edge` `rgba(28,28,28,0.20)` | Form input underline (rest state) |
| `1.5px` | `rgba(255,253,250,0.70)` | Photo crop marks (on the image, always cream) |
| `2px` | `--ela-accent` `#FF6218` | Date-block left border, active-state left borders |
| `2.5px` | `--ela-accent` `#FF6218` | The "you're subscribed" stamp only |

`border-radius` is **`2px`**, everywhere, or `0`. Circles (`50%`) exist only for the 6px/9px accent
dots, which we do not ship (see §10). There is no other radius in the design. Photo frames, image
wells and table rows are square (`0`); buttons, cards, chips and inputs are `2px`.

Hover borders go to full `--ela-ink` (`#1C1C1C`), never to a heavier weight. The line does not get
thicker on hover, it gets darker.

---

## 5. The photo frame

The single most recognisable object in the design. Three parts, always all three.

```
┌─ paper mat ────────────────┐   background: --ela-paper
│ ┌─ well ─────────────────┐ │   padding: 12px 12px 0
│ │ ⌐               ¬      │ │   border: 1px solid --ela-rule
│ │      (image)           │ │
│ │ ⌐               ¬      │ │   well: background --ela-well (#15130F)
│ └────────────────────────┘ │         overflow hidden, aspect-ratio set
│  MONO METADATA BAR         │   bar: 11px 4px 12px
└────────────────────────────┘
```

**1. The mat.** `background: var(--ela-paper)` · `border: 1px solid var(--ela-rule)` ·
`padding: 12px 12px 0` (asymmetric: no bottom padding, the metadata bar provides it).
Small variant (event row thumb, subscribe face strip): `padding: 5px 5px 0` with a `5px` spacer div
standing in for the missing bar.

**2. The well.** `position: relative` · `background: #15130F` · `overflow: hidden` ·
`aspect-ratio` per context:

| Context | Aspect | Crop marks | Size | Inset | Export at |
| --- | --- | --- | --- | --- | --- |
| Hero, wide | `21/9` | 4 | `16px` | `14px` | 2400 × 1029 |
| Hero, portrait | `4/5` | 4 | `16px` | `14px` | 1200 × 1500 |
| Band | `3/2` | 4 | `16px` | `14px` | 1800 × 1200 |
| Card | `4/3` | 2 | `13px` | `10px` | 1200 × 900 |
| Event row thumb | `1/1` | none | — | — | 600 × 600 |

**Four marks is the standalone-photo treatment, two is the card treatment.** That is the rule the
mockup's diagonal pair encodes, and it is what decides the count for any new frame.

**ADDED:** the portrait hero (`4/5`), because the home page hero puts the photo in the right column
beside the headline rather than in a band underneath. **ADDED:** the band (`3/2`), for a run of
standalone photos across a page, as on About. Both keep all four marks.

The image itself carries `filter: contrast(1.05) saturate(0.96)` and is overlaid with
`linear-gradient(rgba(217,96,14,0.07), rgba(28,28,28,0.05))` at `mix-blend-mode: multiply`.
That warm multiply is what makes every photo on the site look like it was shot on the same night.
`pointer-events: none` on the overlay.

**3. The crop marks.** Four absolutely positioned empty divs, one per corner, each showing only its
two outer borders:

```css
/* hero: 16px marks, 14px inset. cards: 13px marks, 10px inset. */
.crop { position: absolute; width: 16px; height: 16px; pointer-events: none;
        border-color: rgba(255,253,250,0.70); border-style: solid; border-width: 0; }
.crop-tl { left: 14px;  top: 14px;    border-left-width: 1.5px; border-top-width: 1.5px; }
.crop-tr { right: 14px; top: 14px;    border-right-width: 1.5px; border-top-width: 1.5px; }
.crop-bl { left: 14px;  bottom: 14px; border-left-width: 1.5px; border-bottom-width: 1.5px; }
.crop-br { right: 14px; bottom: 14px; border-right-width: 1.5px; border-bottom-width: 1.5px; }
```

Marks are **always** `rgba(255,253,250,0.70)`, never orange, never ink, and they do not change in
dark mode — they sit on a photo, not on the page.

**Hero uses all four corners. Cards use two, top-left and bottom-right only.** That diagonal pair is
deliberate; it reads as a crop instruction rather than a frame. Do not "fix" it to four.

**4. The empty slot.** **ADDED** for the build, since there are no photographs yet.

A slot with no file renders the frame exactly as it will ship: same mat, same well, same aspect
ratio, same crop marks, same caption bar. Only the contents change, so nothing reflows when the
photos land. Inside the well:

- a `1px` dashed box at `inset: calc(crop-inset + crop-size + 8px)`, so it never collides with the
  crop marks
- a faint diagonal cross, which is what makes it read as an empty slot at any size, including the
  96px event thumbs
- the path the real file goes at, plus the aspect ratio and the recommended export size

All three use `--ela-slot-line` / `--ela-slot-ink`, which do not change between modes: they sit
inside the well, on the photo's ground, not on the page's.

Thumbs are too small for the text and show only the dashed box and the cross.

Swapping a real photo in is one edit at the path the slot prints: an `image` field on a row in
`src/data/issues.ts` or `src/data/events.ts`, or an `src` in `src/data/photos.ts` for the slots that
belong to no data row.

**5. Optional category chip.** Absolutely positioned `left: 0; bottom: 0` on the well, mono `10px`
`0.16em` uppercase, `padding: 5px 9px`, `pointer-events: none`. Orange fill `#FF6218` with `#FFFDFA`
text for a live/featured category; ink fill `#1C1C1C` with `#FFFDFA` for everything else. Only one
orange chip in view at a time (§1).

---

## 6. Mono metadata bars

The horizontal strips of Courier Prime that sit under photos, across the top of the page, and along
the bottom of cards. Shared anatomy:

- `display: flex` · `flex-wrap: wrap` · `align-items: baseline`
- gap `8px 20px` (photo bar) or `18px` (top bar)
- font: Courier Prime, `10.5px`, `0.13em`–`0.16em`, uppercase
- colour `--ela-ink-muted`; the **first** item may be `--ela-ink` to act as the title
- last item pushed right with `margin-left: auto`, which becomes `margin-left: 0` at ≤900px

Three instances, memorise the shape:

| Bar | Padding | Left | Middle | Right |
| --- | --- | --- | --- | --- |
| Top strip (ink ground) | `7px 30px` | accent-light location | context | issue + date |
| Photo bar (page ground) | `11px 4px 12px` | ink title | date | counter |
| Footer legal | `22px 0 0` | copyright | — | links |

The top strip is the one place the design puts mono on `#1C1C1C` full-bleed: text
`rgba(255,253,250,0.62)`, first item `#FF8426`.

---

## 7. Numbered section headers

Every section is numbered. The number is part of the eyebrow, not a separate element.

```
──  01 · START HERE          ← eyebrow: 26px rule + mono
LATEST ISSUES                ← H2: display-5
────────────────────────────  ← 1px --ela-rule, then 34px of air
```

**Eyebrow:** `display: flex; align-items: center; gap: 10px`, then a `26px × 1px` span filled with
`--ela-accent-dark`, then the label in Courier Prime `11px` `0.16em` uppercase `--ela-accent-dark`.
Label format is `NN · Name`, e.g. `01 · Start here`. Margin-bottom `12px` inside a header block,
`18px`–`22px` when standalone.

**PORT:** the mockup writes this separator as an em dash (`01 — Start here`). The copy rules forbid
em dashes in anything user-facing, so the site uses a middot, which the design already uses as a
separator in the footer legal line and the photo metadata bar. Same rhythm, allowed character.

On the orange band, the eyebrow rule becomes `rgba(255,253,250,0.60)` and the label
`rgba(255,253,250,0.78)`. In dark mode both become `--ela-accent-light`.

**Header block:** `display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap` with
`border-bottom: 1px solid var(--ela-rule)`, `padding-bottom: 16px`. Any trailing action
(`Read the archive →`, the events tab group) is pushed right with `margin-left: auto` and drops to
`margin-left: 0` at ≤900px.

Homepage numbering as built: `01 · Start here`, `02 · About`, `03 · Newsletter`, `04 · Events`,
`05 · Subscribe`. Numbers are per page and restart at `01` on each page.

---

## 8. The ruled table

Used for events, and the pattern any list of records on this site should reuse.

**Column header row** — mono `10px` `0.18em` uppercase `--ela-ink-muted`,
`padding: 0 0 10px`, `border-bottom: 1px solid var(--ela-rule)`, `gap: 16px`. Hidden entirely at
≤900px; the rows reflow to stacked cards.

Column widths (events): `46px` No. · `92px` Date · `96px` Photo · `1 1 auto` Event ·
`200px` Location · `96px` Details, right-aligned.

**Data row** — `display: flex; flex-wrap: wrap; align-items: center`, `gap: 14px 16px`,
`padding: 18px 8px`, `margin: 0 -8px` (so the hover bleed extends past the content edge),
`border-bottom: 1px solid var(--ela-hairline)`, `border-radius: 2px`,
`transition: background .15s ease`.

**Hover** — `background: rgba(28,28,28,0.035)` in light mode, `rgba(255,253,250,0.05)` in dark.
Nothing else moves. No lift, no shadow, no border change.

**The date block** is the signature cell: `border-left: 2px solid var(--ela-accent)`,
`padding-left: 11px`, stacked, month in mono `10px` `0.16em` `--ela-accent-dark` above the day
number in Riegal `26px` `-0.02em`.

**Row index** is mono `12px` in `--ela-ink-faint`, zero-padded to two digits (`01`, `02`).

**Row CTA** is mono `11px` `0.14em` uppercase `--ela-accent-dark` with a trailing ` →`.

A featured or live row gets `background: rgba(255,98,24,0.06)` and hover `rgba(255,98,24,0.11)`,
with the leading number in `--ela-accent-dark`. Only one such row at a time.

**Grid-cell variant** (proof strip): a `repeat(4, 1fr)` grid inside a top-and-bottom-ruled
container, each cell `padding: 26px 22px` with `border-right: 1px solid var(--ela-rule)` except the
last. Collapses to two columns at ≤900px. Number in Riegal `stat` step, label in mono `10.5px`
`0.16em` uppercase `--ela-ink-muted`, `margin-top: 8px`.

### Ruled grids: use the gap, not per-cell borders

For any ruled grid of more than one row, draw the dividers with a `1px` gap over a ruled ground
rather than putting borders on the cells:

```css
.grid { display: grid; gap: 1px; background: var(--ela-rule); }
.grid > * { background: var(--ela-ground); }   /* or --ela-paper */
```

The mockup's own stat grid does this. It is not a style preference: per-cell border arithmetic has
to be redone every time the column count changes at a breakpoint, and it gets the first and last
cell of each row wrong. The gap technique is correct at any column count and any cell height.

**Do not put `items-start` on such a grid.** The cells have to stretch to the row height, or the
ruled ground shows through under the shorter one as a grey block.

---

## 9. Cards

One card treatment. It is the photo frame with a body bolted on.

```
background: var(--ela-paper)
border: 1px solid var(--ela-rule)
padding: 12px 12px 0
border-radius: 0        /* the mat is square; only buttons/chips get 2px */
transition: box-shadow .2s ease, border-color .2s ease
```

- **Well:** `aspect-ratio: 4/3`, two crop marks (TL + BR), optional category chip bottom-left.
- **Body:** `padding: 16px 4px 18px`. Headline in Riegal `title-1`. Then `margin-top: 14px`,
  `padding-top: 11px`, `border-top: 1px solid var(--ela-hairline)`, and a mono `10.5px` `0.12em`
  uppercase row: date on the left, `Read →` in `--ela-accent-dark` pushed right.
- **Hover:** `border-color: var(--ela-ink)` and `box-shadow: 0 22px 40px -34px rgba(28,28,28,0.7)`.
  No transform, no scale. The card gets more present, it does not move.

Whole card is a single `<a>`; there is no separate link target inside it.

### Shadows

Three, and only these three:

| Name | Value | Use |
| --- | --- | --- |
| `shadow-card` | `0 22px 40px -34px rgba(28,28,28,0.70)` | Card hover |
| `shadow-panel` | `0 40px 70px -50px rgba(28,28,28,0.60)` | Subscribe form panel |
| `shadow-hero` | `0 1px 0 rgba(28,28,28,0.04), 0 40px 70px -60px rgba(28,28,28,0.85)` | Hero photo frame |

All are far-throw and heavily negative-spread: the design never shows a tight drop shadow. In dark
mode shadows are suppressed (they read as smudges on `#1C1C1C`); depth comes from `--ela-rule`.

---

## 10. Buttons and chips

| Style | Spec |
| --- | --- |
| **Primary (anchor orange)** | `background: #FF6218` · `color: #FFFDFA` · Manrope `15px/700` · `padding: 16px 26px` · `radius: 2px` · hover `background: #FF8426` |
| **Primary, nav size** | same, Manrope `14px/700` · `padding: 11px 20px` |
| **Primary, footer size** | same, Manrope `14px/700` · `padding: 12px 20px` |
| **Secondary (outline)** | `border: 1px solid rgba(28,28,28,0.30)` · `color: var(--ela-ink)` · transparent · Manrope `14.5px/700` · `padding: 14px 26px` · radius `2px` · hover `background: var(--ela-ink); color: var(--ela-paper); border-color: var(--ela-ink)` |
| **Ink (form submit)** | `background: #1C1C1C` · `color: #FFFDFA` · Manrope `15.5px/700` · `padding: 17px 24px` · full width · hover `background: #FF6218` |
| **Quiet link** | Manrope `14.5px/700` · `color: var(--ela-ink)` · `border-bottom: 1.5px solid #FF6218` · `padding-bottom: 2px` · hover `color: var(--ela-accent-dark)` |
| **Toggle, off** | mono `11px` `0.14em` uppercase · transparent · `color: var(--ela-ink-muted)` · `padding: 10px 18px` |
| **Toggle, on** | same box · `background: #1C1C1C` · `color: #FFFDFA` |
| **Toggle group** | `border: 1px solid rgba(28,28,28,0.20)` · `radius: 2px` · `overflow: hidden` · children have `border: 0` |
| **Role chip, off** | mono `12px` `0.12em` uppercase · `border: 1.5px solid rgba(28,28,28,0.20)` · `color: var(--ela-ink-muted)` · `padding: 13px 10px` · `radius: 2px` · `flex: 1 1 120px` · centred |
| **Role chip, on** | `border: 1.5px solid #1C1C1C` · `background: #1C1C1C` · `color: #FFFDFA` |

All state changes are `transition: all .15s ease` (chips, toggles) or `.2s ease` (cards).

**Note on the ink submit button:** the mockup's subscribe form submits with an *ink* button that
turns orange on hover, while the orange anchor button lives in the nav. That is the one-anchor rule
being enforced inside a single viewport. Keep it.

### Form inputs

`border: 0` with `border-bottom: 1.5px solid rgba(28,28,28,0.20)`, transparent background,
Courier Prime `17px`, `padding: 9px 2px`, no outline, and on focus the underline becomes
`#FF6218`. Placeholder is `rgba(28,28,28,0.32)`. Labels above in mono `10px` `0.16em` uppercase
`--ela-ink-muted`, `margin-bottom: 8px`.

Focus-visible on everything else is a `2px` `--ela-accent` outline with `2px` offset. **ADDED** —
the mockup has no keyboard focus states at all, and we are not shipping that.

---

## 11. Where the orange goes

Ranked by weight, so the budget is spendable in order:

1. **Anchor fill** — one per viewport. Subscribe button, or the orange section band, or one
   featured chip. `#FF6218`.
2. **Section band** — full-bleed `#FF6218` with `#FFFDFA` type. One per page maximum. Everything
   inside it (eyebrow rules, muted copy) shifts to `rgba(255,253,250,0.60–0.86)`.
3. **Structural hairlines** — `26px` eyebrow rule, `2px` date-block left border, card top-border on
   hover. `#D9600E` in light, `#FF8426` in dark.
4. **Directional text** — `Read →`, `RSVP →`, `Photos →`, tab labels. `#D9600E` in light (never
   below 14px in light mode is preferred; the mockup uses 10.5–11.5px mono here, which is
   AA-large-failing, so **these must be paired with a non-orange sibling label in the same row**,
   which they always are: the date sits beside them).
5. **Tints** — featured row `rgba(255,98,24,0.06)`, its hover `rgba(255,98,24,0.11)`, the hero
   headline highlight `#FF6218` at `opacity: 0.22` behind the last line, the photo multiply
   `rgba(217,96,14,0.07)`.

Never orange: body paragraphs in light mode, nav links, footer body links, form input text,
headlines, the wordmark.

---

## 12. Logo placement

Wordmark only. There is no emblem, icon or monogram anywhere on the site, including the favicon.

Two files, both trimmed to the glyph bounding box so they scale predictably:

| File | Fill | Ground it goes on |
| --- | --- | --- |
| `public/logo/wordmark-black.svg` | `#000000` | Ground `#F5F0EB`, Paper `#FFFDFA`, and any photo lighter than mid |
| `public/logo/wordmark-cream.svg` | `#F5F0EB` | Ink `#1C1C1C`, Well `#15130F`, orange `#FF6218`, and any photo darker than mid |

Intrinsic aspect ratio **5.34 : 1** (viewBox `166 957 1912 358`). The lockup is two lines:
`emerging` over `LOS ANGELES`.

**Placement rule.** The wordmark never sits on a ground it disappears into:

- Cream wordmark on Ground, Paper, or any tint of them — **forbidden**, it vanishes.
- Black wordmark on Ink, Well, or the orange band — **forbidden**, it vanishes.
- On the orange band (`#FF6218`), use **cream**. Black on orange is 3.9:1 and reads as a mistake
  next to the cream body type in the same band.
- On a photograph, the wordmark needs either a solid backing block (Ink or Paper, `2px` radius) or
  a `≥60%` scrim in the opposing tone. Never place it directly on an unmodified image.
- The two files are the only two options. Do not recolour the wordmark to orange, to muted ink,
  or to anything else.

**Sizing.** Minimum width is **120px** and that minimum is a hard floor, not a target. The mobile
bar renders the wordmark at `120px` down to a `320px` viewport and it must not be clipped: give the
wordmark `flex: 0 0 auto` and let the nav's other children shrink. A previous build set a minimum
above 120px and clipped the bar below 350px. Do not do that again.

| Context | Width |
| --- | --- |
| Nav, desktop | `168px` |
| Nav, ≤900px | `120px` (floor) |
| Focus pages (subscribe, thanks) | `200px`, centred |
| Footer | `clamp(220px, 26vw, 340px)` |

**Clear space** on all four sides is `0.5 ×` the wordmark's rendered height. At the `120px` floor
that is `11px`.

**Dropped from the mockup:** the mockup pairs the wordmark with a `6px` (nav) / `9px` (footer)
orange dot. That is an emblem. It is not shipped. Its job — a spot of orange in the nav — is done by
the Subscribe button instead.

**Favicon** is `public/favicon.svg`: the full wordmark on a `#F5F0EB` square. Note that a 5.34:1
lockup in a 16px tab is legible as a shape, not as words. The alternative that stays inside the
no-emblem rule is cropping to the `e`, which is a lettermark; flag it if the tab treatment matters.

---

## 13. Motion

Almost none, and that is the design.

| Thing | Value |
| --- | --- |
| Card hover | `box-shadow .2s ease, border-color .2s ease` |
| Table row hover | `background .15s ease` |
| Chips, toggles | `all .15s ease` |
| Everything else | none |

No scroll animation, no reveals, no parallax, no counters. The v1 mockup had a marquee and a
blinking dot; v2 removed both, and v2 is the source of truth. All of the above is wrapped in
`@media (prefers-reduced-motion: reduce)` to `transition: none`.

---

## 14. Dark mode

**ADDED** — the mockup is light-only with dark *blocks*. Dark mode is the same design with the
ground and ink swapped, using the tokens in §1. Specifics that are not a straight swap:

- **Shadows off.** `--ela-shadow-card` and friends resolve to `none`. Depth is rules only.
- **Orange steps up.** `--ela-accent-dark` (`#D9600E`) is the light-mode structural orange;
  `--ela-accent-light` (`#FF8426`) is the dark-mode one. `--ela-accent-step` resolves to the right
  one per mode, so components reference `--ela-accent-step`, never the raw value.
- **Photo wells do not change.** `#15130F` → `#0F0E0C` is a small deepening only; crop marks,
  multiply overlay and image filter are identical in both modes. A photograph looks the same in
  both themes.
- **The orange band stays orange** in dark mode. It is the one element that does not invert.
- **Paper is darker than ground** in dark mode (`#141311` on `#1C1C1C`). Raised surfaces read as
  wells, matching how the mockup's dark blocks behave.

Mode is driven **only** by `data-theme` on `<html>`. There is no `prefers-color-scheme` rule
anywhere in the codebase, deliberately: see §16.

---

## 15. Surface classes

A block whose ground differs from the page re-points the tokens once, at the block, instead of
every child opting out of them. Children keep writing `text-ink` and `border-rule` and come out
right. There are three, and between them they cover every ground on the site.

| Class | Ground | Ink | Where |
| --- | --- | --- | --- |
| `.on-ink` | Ink `#1C1C1C` | cream | Top strip, footer |
| `.on-accent` | Accent `#FF6218` | see below | The subscribe band |
| `.on-paper` | Ground / Paper, light palette, never inverts | ink | Panels sitting on the band |

**`.on-accent` inverts what "muted" means.** Cream on this orange is 3.32:1, which is large text
only. So `ink` stays cream and is for display sizes and the wordmark, while `ink-muted` (4.73:1)
and `ink-muted-aa` (5.69:1) are **near-black**. On orange, the readable colour for body copy and
small print is the dark one, and the tokens say so rather than leaving it to each element.

**`.on-paper` exists because `.on-accent` re-points `paper` to orange.** A form panel inside the
band would otherwise be orange on orange. `.on-paper` resets a surface to the light palette in
both modes, which is right: the band stays orange in dark mode, so its panel stays paper.

One token follows the surface rather than the page, and has to: `--ela-placeholder`. An input on a
paper panel needs a dark placeholder even when the page is in dark mode.

---

## 16. The mode toggle

**ADDED.** A switch, built as a piece of equipment rather than a rounded pill, because the rest of
the page is hairlines, hard corners and mono markings.

```
 light                        dark
┌──────────┬──────────┐     ┌──────────┬──────────┐
│ ███║║║██ │  DARK    │     │  LIGHT   │ ███║║║██ │
└──────────┴──────────┘     └──────────┴──────────┘
   knob left                            knob right
```

| Part | Spec |
| --- | --- |
| Track | `84 × 26px` · `1px solid var(--ela-edge)` · radius `2px` · `overflow: hidden` |
| Track fill | `repeating-linear-gradient(90deg, var(--ela-hairline) 0 1px, transparent 1px 4px)` |
| Track hover | `border-color: var(--ela-ink)`. Darker, never thicker. |
| Position markings | Courier Prime `10px` `0.10em` uppercase `--ela-ink-muted-aa`, one per half |
| Knob | `40 × 22px` at `top/left: 1px` · `background: var(--ela-ink)` · radius **`0`** |
| Knob grip | `9 × 8px` centred, `repeating-linear-gradient(90deg, var(--ela-ground) 0 1px, transparent 1px 4px)` |
| Throw | `translateX(42px)` (82px inner width minus the 40px knob) |
| Easing | `transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)` |

Three things carry the design:

- **The tick scale.** A printed rule across the track, the way a measuring scale is printed onto a
  physical control. It is what stops the track reading as an empty pill.
- **The milled grip.** Cut in the ground colour, so it reads as machined out of the knob rather
  than drawn on it.
- **The knob is a solid block of the current ink.** Dark on the cream ground, cream on the dark
  one. The switch shows you the ink the page is currently set in.

The knob covers the position it is currently in, so **the marking you can read is the one you are
about to switch to**. The knob is square where the housing is `2px`: an inset moving part reads as
machined when it is sharper than the thing around it.

**Never orange.** It sits in the nav beside Subscribe and would otherwise be a second anchor in
that viewport. The only orange it ever shows is the site's standard `2px` focus ring.

**Placement.** Desktop: right side of the nav, separated from Subscribe by a `20 × 1px`
`--ela-rule` hairline, so the control and the action read as separate things. Mobile: the last row
of the menu, under a hairline, with a `Mode` mono label on the left and the switch on the right.

### Behaviour

- **Light is the default for everyone.** A first-time visitor on a phone set to dark still gets the
  light site. `data-theme="light"` is written into the markup, so this holds with JavaScript off.
- The choice persists in `localStorage` under `ela-theme`.
- **The OS preference never moves the mode**, not on first visit and not when it changes mid
  session. The toggle is the only thing that changes it.
- A 106 byte synchronous script is the first node in `<head>`, before the stylesheet, and restores
  a stored choice before first paint. There is no flash of the wrong mode.
- `role="switch"` with `aria-checked` and an `aria-label` of `Dark mode`. Real `<button>`, so Space
  and Enter both work and the focus ring is the site's standard one.
- `prefers-reduced-motion` drops the transition to nothing and keeps the state change, through the
  global rule in `global.css`.

---

## 17. Two rules for reused sections

Both came out of building the same pattern on a second and third page.

**A variant must isolate its differences.** `EventsTable` renders the upcoming
and past tables. Every difference between them lives in one `VARIANTS` object at
the top of the component and lands in exactly one place: the trailing cell of
each row, plus that column's heading. Nothing else in the template reads
`variant`. That is testable, and it is tested: the header signature, the row
signature with the trailing cell removed, and the rendered column geometry are
all identical between the two. If a variant ever needs a second difference, it
goes in `VARIANTS`, not in the markup.

**Section numbers are computed, not typed.** A page whose sections can
disappear cannot hardcode `01`, `02`, `03`. The Events page hides Upcoming when
nothing is upcoming, and hides Past when nothing has run. So it builds the list
of sections that are actually rendering and numbers from that:

```ts
const sections = [
  'header',
  upcoming.length > 0 && 'upcoming',
  past.length > 0 && 'past',
  'photos', 'how', 'subscribe',
].filter(Boolean) as string[];

const n = (key: string) => String(sections.indexOf(key) + 1).padStart(2, '0');
```

With no upcoming events the page numbers 01, 02 Past, 03, 04, 05, with no hole
where Upcoming used to be. Any page with a conditional section does this.

**There is no empty state anywhere on this site.** A section with nothing in it
does not render. `EventsTable` returns nothing for an empty list, and the caller
wraps the whole section in the same length check. Do not add an "assign an empty
state" component; the absence is the design.

---

## 18. The showcase card

A grid of issue cards can promote one of them. The promoted card gets an orange
gradient well:

```css
--ela-well-accent: linear-gradient(155deg,
  var(--palette-accent-light) 0%, var(--palette-accent) 45%, var(--palette-accent-dark) 100%);
```

Three rules go with it.

**One orange element per accent card.** Where there is no gradient well, the
category chip carries the accent (the home page). Where there is one, the well
carries it and the chip inverts to near-black, because orange on orange is
invisible and cream on this orange is 3.32:1. Same inversion as `.on-accent`.
The empty slot's text and dashed box invert with it, and the warm multiply is
switched off: that overlay is for photographs, and over a flat gradient it only
muddies.

**Opt in per grid, not per card.** The gradient is scoped to
`.grid-showcase [data-accent]`. The archive is a page of nothing but issues and
wants one card to carry the section; on the home page the issues are one section
of five, where the chip alone is enough. One attribute drives both.

**The accent is a view decision, never a data flag.** It belongs to the first
card of the current view, so it recalculates whenever the view changes and
cannot vanish when the card holding it is filtered out. `IssueCard` takes an
`accent` prop that sets `data-accent` and nothing else, so a filter script moves
the whole treatment by moving one attribute. Clear it from every card before
setting it, or you end up with two.

### Counting anchors when a fill is a gradient

An anchor is a solid orange fill of real area, and a gradient is one. A sweep
that only reads `background-color` misses it completely, so it has to read
`background-image` too. It also has to collapse nesting: an orange chip inside
an orange well is one orange region, not two, so only the outermost element
counts.

---

## 19. When a section may not disappear

The site's default is that a section with nothing in it does not render, and
there is no empty state (§17). **A filter with no matches is the exception.**

The difference is who caused the emptiness. A section with no content is empty
because of us, and silence is the honest answer. A filter with no matches is
empty because the visitor did something, and vanishing leaves them looking at a
gap wondering whether the site broke. That case gets a real empty state: one
line naming what happened, one line saying where everything went, and a control
that puts it back.

Do not reach for the disappearing-section pattern anywhere a visitor's own
action produced the empty result.

---

## 20. A component does not declare its own surface

`SubscribeForm` used to carry `.on-paper` itself, because the first place it
appeared was inside the orange band, where a panel would otherwise come out
orange on orange. That was the right pixel result for the wrong reason, and it
broke the moment the same form appeared on `/subscribe`: a bright white slab on
a dark page, because the form was forcing a light palette nothing had asked for.

**The surface is a fact about where a thing sits, so the caller declares it.**
The band passes `.on-paper` to the form; the standalone page passes nothing and
the panel follows the page into dark mode like every other raised surface. Same
component, same fields, two correct results.

The general rule: `.on-ink`, `.on-accent` and `.on-paper` go on the element that
owns the ground, or are passed in by whoever put the child on that ground. A
component that re-points its own tokens is only correct in the one place it was
first used.
