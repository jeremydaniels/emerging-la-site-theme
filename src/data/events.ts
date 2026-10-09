/**
 * Events, read from the deal tracker's Supabase at build time.
 *
 * ============================================================================
 *  ONE READ POINT
 *
 *  `getEvents()` is the only thing on the site that talks to Supabase. Pages
 *  and components take `EventItem`s and nothing else, the same way the archive
 *  takes `Issue`s from `getIssues()`.
 *
 *  Source: the `events` table defined in the tracker repo's db/events.sql. The
 *  anon key can only read rows that pass its "public read visible events"
 *  policy (LA County, not hidden, not a placeholder, not removed). This file
 *  adds one filter on top, `featured = true`, which is set by hand in the
 *  tracker's table editor.
 *
 *  Two env vars, read at build time only. Neither is prefixed PUBLIC_, and
 *  nothing here puts either one in a page.
 *
 *    TRACKER_SUPABASE_URL        https://<project>.supabase.co
 *    TRACKER_SUPABASE_ANON_KEY   the anon (public) key
 *
 *  This can never fail a build. A missing var, a non 200, a timeout or a body
 *  that is not a list all log one warning and return no events, and the pages
 *  hide the empty sections.
 *
 *  Upcoming and past are not stored. They come from each event's date at build
 *  time, in Pacific time. The site rebuilds daily from a deploy hook, so an
 *  event moves from Upcoming to Past on the first rebuild after its day ends.
 * ============================================================================
 */

export interface EventItem {
  /** Stable id: the Luma UID from the tracker. */
  slug: string;
  name: string;
  /** Pacific calendar date, YYYY-MM-DD. */
  date: string | null;
  /** Pacific start time with the zone written out, e.g. "6:30 PM Pacific Time". */
  time: string | null;
  /** Venue and city, or "Online", or "Address on Luma". Never a street. */
  location: string | null;
  /** One line under the name. The host, when the tracker has one. */
  note: string | null;
  /** Where RSVP or the recap goes: external_url, else the Luma page. */
  url: string | null;
  /** Luma CDN cover image, or null. A null renders the row without a photo. */
  image: string | null;
  imageAlt?: string;
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

const PACIFIC = 'America/Los_Angeles';

const dateParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: PACIFIC,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: PACIFIC,
  hour: 'numeric',
  minute: '2-digit',
});

/** YYYY-MM-DD on the Pacific calendar. en-CA formats as exactly that. */
export function pacificDate(when: Date): string {
  return dateParts.format(when);
}

/** "6:30 PM Pacific Time". Always "Pacific Time", so it reads right in PST and PDT alike. */
export function pacificTime(when: Date): string {
  return `${timeFormat.format(when)} Pacific Time`;
}

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------

const COUNTRY = /^(?:usa|us|u\.s\.a\.|united states(?: of america)?)$/i;
const STATE_AND_ZIP = /^(?:ca|calif\.?|california)(?:\s+\d{5}(?:-\d{4})?)?$/i;
const ZIP = /^\d{5}(?:-\d{4})?$/;
const STATE = /^(?:ca|calif\.?|california)$/i;
const STREET_WORD =
  /\b(?:st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|way|ln|lane|pl|place|hwy|highway|pkwy|parkway|ct|court|cir|circle|ter|terrace)\b/i;

/** "800 S La Brea Ave" is a street. "1 Hotel West Hollywood" is a venue that starts with a number. */
function looksLikeStreet(part: string): boolean {
  return /^\d+[a-z]?\s/i.test(part) && STREET_WORD.test(part);
}

/**
 * The venue and city out of a Luma address.
 *
 *   "All Season Brewing Company, 800 S La Brea Ave, Los Angeles, CA 90036, USA"
 *     gives "All Season Brewing Company, Los Angeles"
 *   "11648 San Vicente Blvd, Los Angeles, CA 90049, USA" gives "Los Angeles"
 *
 * The street is left out on purpose. The page says roughly where, and the exact
 * address is on the Luma page behind the RSVP link.
 */
function venueFromLocation(location: string): string {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 0 && COUNTRY.test(parts[parts.length - 1])) parts.pop();
  if (parts.length > 0 && STATE_AND_ZIP.test(parts[parts.length - 1])) {
    parts.pop();
  } else if (parts.length > 1 && ZIP.test(parts[parts.length - 1]) && STATE.test(parts[parts.length - 2])) {
    parts.pop();
    parts.pop();
  }

  if (parts.length === 0) return '';
  if (parts.length === 1) return looksLikeStreet(parts[0]) ? '' : parts[0];

  const city = parts[parts.length - 1];
  const first = parts[0];
  const venue = first !== city && !looksLikeStreet(first) ? first : '';

  if (!venue) return city;
  return venue.toLowerCase().includes(city.toLowerCase()) ? venue : `${venue}, ${city}`;
}

/** Luma hides the address until you register, and the table then holds no location or a bare link. */
function placeFor(location: string, isOnline: boolean): string {
  if (isOnline) return 'Online';
  if (!location || /^https?:\/\//i.test(location)) return 'Address on Luma';
  return venueFromLocation(location) || 'Address on Luma';
}

// ---------------------------------------------------------------------------
// Rows
// ---------------------------------------------------------------------------

/** Luma's image hosts. Any subdomain, never the bare domain. */
const COVER_HOSTS = ['.lumacdn.com', '.lu.ma', '.luma.com'];

/** https on a Luma image host, or null. The value comes from a database and ends up in an img src. */
function safeCoverUrl(value: string): string | null {
  if (!value || value.length > 2048) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const ok = url.protocol === 'https:' && COVER_HOSTS.some((s) => host.length > s.length && host.endsWith(s));
    return ok ? value : null;
  } catch {
    return null;
  }
}

/** http or https only, since it ends up in an href. */
function safeHttpUrl(value: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : null;
  } catch {
    return null;
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** "Hosted by AI LA & Josh Jacobs" becomes "AI LA & Josh Jacobs". */
function cleanHostedBy(value: string): string {
  return value
    .replace(/^\s*hosted\s+by\s*:?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reads one row without trusting it. A row with no UID, no title or no
 * readable start is dropped. Everything else that is missing or the wrong type
 * becomes null.
 */
function toEventItem(row: unknown): EventItem | null {
  if (typeof row !== 'object' || row === null) return null;
  const r = row as Record<string, unknown>;

  const uid = text(r.luma_uid);
  const title = text(r.title);
  const start = new Date(text(r.start_at));
  if (!uid || !title || Number.isNaN(start.getTime())) return null;

  const hostedBy = cleanHostedBy(text(r.hosted_by));

  return {
    slug: uid,
    name: title,
    date: pacificDate(start),
    time: pacificTime(start),
    location: placeFor(text(r.location), r.is_online === true),
    note: hostedBy ? `Hosted by ${hostedBy}` : null,
    url: safeHttpUrl(text(r.external_url)) ?? safeHttpUrl(text(r.event_url)),
    image: safeCoverUrl(text(r.cover_url)),
  };
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

const COLUMNS = [
  'luma_uid',
  'title',
  'start_at',
  'location',
  'hosted_by',
  'event_url',
  'external_url',
  'is_online',
  'cover_url',
].join(',');

/** One page of rows. Featured is hand picked, so this is far past anything real. */
const LIMIT = 1000;
const TIMEOUT_MS = 10_000;

function warn(reason: string): void {
  // Never print the URL or the key, only what went wrong.
  console.warn(`[events] ${reason} The site builds with no events.`);
}

async function fetchEvents(): Promise<EventItem[]> {
  const base = (import.meta.env.TRACKER_SUPABASE_URL ?? '').trim();
  const key = (import.meta.env.TRACKER_SUPABASE_ANON_KEY ?? '').trim();

  if (!base || !key) {
    warn('TRACKER_SUPABASE_URL or TRACKER_SUPABASE_ANON_KEY is not set.');
    return [];
  }

  try {
    const url =
      `${base.replace(/\/+$/, '')}/rest/v1/events` +
      `?select=${COLUMNS}&featured=eq.true&order=start_at.asc,luma_uid.asc&limit=${LIMIT}`;

    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      warn(`The tracker answered ${res.status}.`);
      return [];
    }

    const body: unknown = await res.json();
    if (!Array.isArray(body)) {
      warn('The tracker returned something other than a list.');
      return [];
    }

    const seen = new Set<string>();
    const items: EventItem[] = [];
    for (const row of body) {
      const item = toEventItem(row);
      if (item && !seen.has(item.slug)) {
        seen.add(item.slug);
        items.push(item);
      }
    }
    return items;
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
    warn(timedOut ? `The tracker did not answer within ${TIMEOUT_MS / 1000} seconds.` : 'The tracker could not be reached.');
    return [];
  }
}

/** Home and /events both call getEvents(). One build, one request. */
let pending: Promise<EventItem[]> | undefined;

/** Every featured, visible event, soonest first. Never throws. */
export function getEvents(): Promise<EventItem[]> {
  pending ??= fetchEvents();
  return pending;
}

// ---------------------------------------------------------------------------
// Upcoming and past
// ---------------------------------------------------------------------------

/**
 * Today and later on the Pacific calendar, soonest first. An event stays
 * upcoming until the end of its day, since the date is all the build knows
 * about when it ends.
 */
export function upcomingEvents(list: EventItem[], now: Date = new Date()): EventItem[] {
  const today = pacificDate(now);
  return list
    .filter((e) => e.date !== null && e.date >= today)
    .sort((a, b) => a.date!.localeCompare(b.date!));
}

/** Before today on the Pacific calendar, most recent first. */
export function pastEvents(list: EventItem[], now: Date = new Date()): EventItem[] {
  const today = pacificDate(now);
  return list
    .filter((e) => e.date !== null && e.date < today)
    .sort((a, b) => b.date!.localeCompare(a.date!));
}
