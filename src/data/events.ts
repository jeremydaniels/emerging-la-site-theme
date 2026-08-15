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
  /** ISO date, YYYY-MM-DD. Display and sorting only, never the status. */
  date: string;
  /** Free text, e.g. "6:30 PM". Null when the time is not settled. */
  time: string | null;
  venue: string;
  neighborhood: string;
  /** One line under the event name. */
  note: string;
  /** Luma URL for an upcoming event, or a recap/photos URL for a past one. */
  url: string | null;
  /** Path under /public, or null while there is no photo yet. */
  image: string | null;
  imageAlt?: string;
  /** At most one upcoming event may be featured. It gets the orange row tint. */
  featured?: boolean;
}

export const events: EventItem[] = [
  // Real events go here. Example of the shape:
  //
  // {
  //   slug: 'event-name',
  //   name: '',
  //   status: 'upcoming',   // <-- flip to 'past' by hand after it happens
  //   date: '2026-01-01',
  //   time: null,
  //   venue: '',
  //   neighborhood: '',
  //   note: '',
  //   url: null,
  //   image: null,
  //   featured: false,
  // },
];

/** Soonest first, which is how upcoming events read. */
export function upcomingEvents(list: EventItem[] = events): EventItem[] {
  return list
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Most recent first, which is how past events read. */
export function pastEvents(list: EventItem[] = events): EventItem[] {
  return list
    .filter((e) => e.status === 'past')
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Events flagged 'upcoming' whose date has already passed.
 *
 * Nothing on the site renders this. It exists so the build can warn that
 * somebody needs to flip a flag. See scripts/check-event-flags.mjs.
 */
export function staleUpcoming(
  list: EventItem[] = events,
  today: Date = new Date(),
): EventItem[] {
  const iso = today.toISOString().slice(0, 10);
  return list.filter((e) => e.status === 'upcoming' && e.date < iso);
}
