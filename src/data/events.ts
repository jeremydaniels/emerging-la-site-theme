/**
 * Events. Hand maintained.
 *
 * ============================================================================
 *  READ THIS BEFORE EDITING
 *
 *  `status` is set BY HAND. It is not derived from `date`.
 *
 *  An event does not move itself from Upcoming to Past when its date passes.
 *  After an event happens, somebody has to open this file, change
 *  `status: 'upcoming'` to `status: 'past'`, and deploy. Until that happens the
 *  site will keep showing a finished event as upcoming.
 *
 *  This is on purpose: it keeps an event visible while photos are still being
 *  collected, and it means a postponed event does not silently vanish. The cost
 *  is that it is a manual step and it is easy to forget.
 * ============================================================================
 *
 * The rows currently in here are PLACEHOLDERS, marked `placeholder: true`.
 * Their names are bracketed on purpose. An earlier draft used names like
 * "Founders dinner" and "Demo night", which read as real and get quoted back.
 * Delete these as real events arrive: `grep "placeholder: true"` finds them.
 */

export type EventStatus = 'upcoming' | 'past';

export interface EventItem {
  /** URL-safe id. */
  slug: string;
  name: string;
  /**
   * MANUAL FLAG. Flip this to 'past' after the event happens.
   * Not derived from `date`. See the note at the top of this file.
   */
  status: EventStatus;
  /** ISO date, YYYY-MM-DD. Null until the date is confirmed, and it renders
   *  as a bracketed marker rather than a guess. Display and sorting only,
   *  never the status. */
  date: string | null;
  /** Display text, e.g. "6:30 PM". Null when the time is not settled. */
  time: string | null;
  venue: string;
  neighborhood: string;
  /** One line under the event name. */
  note: string;
  /** Luma URL for an upcoming event, or a recap URL for a past one. */
  url: string | null;
  /**
   * Path under /public, or null while there is no photo yet. Setting this is
   * the single edit that swaps a real photo into the row.
   */
  image: string | null;
  imageAlt?: string;
  /** At most one upcoming event may be featured. It gets the orange row tint. */
  featured?: boolean;
  /** Scaffolding row. Delete when a real event replaces it. */
  placeholder?: boolean;
}

export const events: EventItem[] = [
  {
    slug: 'placeholder-1',
    name: '[Event name one]',
    status: 'upcoming',
    date: null,
    time: null,
    venue: '[Venue]',
    neighborhood: '[Neighborhood]',
    note: '[One line on who this one is for]',
    url: null,
    image: null,
    featured: true,
    placeholder: true,
  },
  {
    slug: 'placeholder-2',
    name: '[Event name two]',
    status: 'upcoming',
    date: null,
    time: null,
    venue: '[Venue]',
    neighborhood: '[Neighborhood]',
    note: '[One line on who this one is for]',
    url: null,
    image: null,
    placeholder: true,
  },
  {
    slug: 'placeholder-3',
    name: '[Event name three]',
    status: 'upcoming',
    date: null,
    time: null,
    venue: '[Venue]',
    neighborhood: '[Neighborhood]',
    note: '[One line on who this one is for]',
    url: null,
    image: null,
    placeholder: true,
  },

  /* Past. Same shape, status flipped by hand. `note` on a past row is where the
     recap line goes, not an attendance count: that would be an invented number
     until somebody counts. */
  {
    slug: 'placeholder-past-1',
    name: '[Past event name one]',
    status: 'past',
    date: null,
    time: null,
    venue: '[Venue]',
    neighborhood: '[Neighborhood]',
    note: '[One line on how this one went]',
    url: null,
    image: null,
    placeholder: true,
  },
  {
    slug: 'placeholder-past-2',
    name: '[Past event name two]',
    status: 'past',
    date: null,
    time: null,
    venue: '[Venue]',
    neighborhood: '[Neighborhood]',
    note: '[One line on how this one went]',
    url: null,
    image: null,
    placeholder: true,
  },
  {
    slug: 'placeholder-past-3',
    name: '[Past event name three]',
    status: 'past',
    date: null,
    time: null,
    venue: '[Venue]',
    neighborhood: '[Neighborhood]',
    note: '[One line on how this one went]',
    url: null,
    image: null,
    placeholder: true,
  },
];

/** Soonest first, which is how upcoming events read. Undated rows go last. */
export function upcomingEvents(list: EventItem[] = events): EventItem[] {
  return list
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'));
}

/** Most recent first, which is how past events read. */
export function pastEvents(list: EventItem[] = events): EventItem[] {
  return list
    .filter((e) => e.status === 'past')
    .sort((a, b) => (b.date ?? '0000').localeCompare(a.date ?? '0000'));
}

/**
 * Events flagged 'upcoming' whose date has already passed. Undated events are
 * never stale: there is no date to be past.
 *
 * Nothing on the site renders this. It exists so the build can warn that
 * somebody needs to flip a flag. See scripts/check-event-flags.mjs.
 */
export function staleUpcoming(
  list: EventItem[] = events,
  today: Date = new Date(),
): EventItem[] {
  const iso = today.toISOString().slice(0, 10);
  return list.filter((e) => e.status === 'upcoming' && e.date !== null && e.date < iso);
}
