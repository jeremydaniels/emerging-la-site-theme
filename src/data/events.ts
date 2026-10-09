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
  /** The same time, short, for the phone layout: "6:30 PM PT". */
  timeShort?: string | null;
  /** Venue and city, or "Online", or "Address on Luma". Never a street. */
  location: string | null;
  /**
   * Just the city, for the phone layout, or "Online". Null when the tracker has no venue or city,
   * and then nothing is shown. Never "Address on Luma".
   */
  city?: string | null;
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

/** "6:30 PM PT", for the one mono line on a phone. */
export function pacificTimeShort(when: Date): string {
  return `${timeFormat.format(when)} PT`;
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

/** An address split on commas with the country, state and ZIP taken off the end. */
function addressParts(location: string): string[] {
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
  return parts;
}

/**
 * The city alone, or an empty string. What is left at the end of a Luma address once the country,
 * state and ZIP are off is the city, so that is what this returns, unless it looks like a street.
 */
function cityFromLocation(location: string): string {
  if (/^https?:\/\//i.test(location)) return '';
  const parts = addressParts(location);
  const last = parts[parts.length - 1] ?? '';
  return last && !looksLikeStreet(last) ? last : '';
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
  const parts = addressParts(location);

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

/** Why a row did not make it onto the page. Printed in the build log next to its title. */
export type DropReason =
  | 'not an object'
  | 'no luma_uid'
  | 'no title'
  | 'no start_at'
  | 'start_at does not parse'
  | 'duplicate luma_uid';

/**
 * Reads one row without trusting it. A row with no UID, no title or no readable
 * start is dropped, and the reason comes back with it. Everything else that is
 * missing or the wrong type becomes null.
 */
function toEventItem(row: unknown): { item: EventItem } | { drop: DropReason; label: string } {
  if (typeof row !== 'object' || row === null) return { drop: 'not an object', label: String(row) };
  const r = row as Record<string, unknown>;

  const uid = text(r.luma_uid);
  const title = text(r.title);
  const label = title || uid || '(untitled row)';
  const startRaw = text(r.start_at);
  // PostgREST writes "+00:00". A bare "+00" offset is Postgres text output and V8 will not parse it.
  const start = new Date(startRaw.replace(/([+-]\d{2})$/, '$1:00'));

  if (!uid) return { drop: 'no luma_uid', label };
  if (!title) return { drop: 'no title', label: uid };
  if (!startRaw) return { drop: 'no start_at', label };
  if (Number.isNaN(start.getTime())) return { drop: 'start_at does not parse', label };

  const hostedBy = cleanHostedBy(text(r.hosted_by));

  return {
    item: {
      slug: uid,
      name: title,
      date: pacificDate(start),
      time: pacificTime(start),
      timeShort: pacificTimeShort(start),
      location: placeFor(text(r.location), r.is_online === true),
      city: r.is_online === true ? 'Online' : cityFromLocation(text(r.location)) || null,
      note: hostedBy ? `Hosted by ${hostedBy}` : null,
      url: safeHttpUrl(text(r.external_url)) ?? safeHttpUrl(text(r.event_url)),
      image: safeCoverUrl(text(r.cover_url)),
    },
  };
}

export interface MappedRows {
  items: EventItem[];
  dropped: { title: string; reason: DropReason }[];
}

/** The whole row-to-event step, with nothing silent: every row is either kept or dropped with a reason. */
export function mapRows(body: unknown[]): MappedRows {
  const seen = new Set<string>();
  const items: EventItem[] = [];
  const dropped: MappedRows['dropped'] = [];
  for (const row of body) {
    const result = toEventItem(row);
    if ('drop' in result) {
      dropped.push({ title: result.label, reason: result.drop });
    } else if (seen.has(result.item.slug)) {
      dropped.push({ title: result.item.name, reason: 'duplicate luma_uid' });
    } else {
      seen.add(result.item.slug);
      items.push(result.item);
    }
  }
  return { items, dropped };
}

/**
 * The one line of build log that says what happened to the rows, titles only.
 * Never the URL, never the key. When nothing came back it also says what kind of
 * key was used, since an empty list from a key that is not the anon role is the
 * quiet failure: the read policy is `to anon`, so any other role sees no rows.
 */
export function summarize(rowsBack: number, mapped: MappedRows, now: Date, keyKind: string): string[] {
  const upcoming = upcomingEvents(mapped.items, now);
  const past = pastEvents(mapped.items, now);
  const lines = [
    `[events] ${rowsBack} row${rowsBack === 1 ? '' : 's'} came back, ${upcoming.length} kept as upcoming, ` +
      `${past.length} kept as past, ${mapped.dropped.length} dropped.`,
  ];
  for (const e of upcoming) lines.push(`[events]   upcoming  ${e.date}  ${e.name}`);
  for (const e of past) lines.push(`[events]   past      ${e.date}  ${e.name}`);
  for (const d of mapped.dropped) lines.push(`[events]   dropped   ${d.title} (${d.reason})`);
  if (rowsBack === 0) {
    lines.push(
      `[events] The tracker answered with an empty list. It only returns rows with featured = true that ` +
        `pass its public read policy, and that policy is for the anon role. The key is ${keyKind}.`,
    );
  }
  return lines;
}

/** What kind of key this is, without printing any of it. A JWT key carries its role in the payload. */
function describeKey(key: string): string {
  if (key.startsWith('sb_publishable_')) return 'a publishable key';
  if (key.startsWith('sb_secret_')) return 'a secret key, not the anon key';
  const payload = key.split('.')[1];
  if (key.split('.').length === 3 && payload) {
    try {
      const role = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).role;
      return typeof role === 'string' ? `a JWT with the role "${role}"` : 'a JWT with no role claim';
    } catch {
      return 'a JWT whose payload does not decode';
    }
  }
  return 'in a format that is not recognized';
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

// Only the type is declared, so the site needs no @types/node. At build time Node provides it.
declare const process: { env: Record<string, string | undefined> } | undefined;
declare const Buffer: { from(data: string, encoding: 'base64url'): { toString(encoding: 'utf8'): string } };

function warn(reason: string): void {
  console.warn(`[events] ${reason.replace(/\.+$/, '')}. The site builds with no events.`);
}

/**
 * A build variable, trimmed. import.meta.env does not always carry variables that
 * exist only in the build environment (Vercel's, for one), so fall back to
 * process.env. Wrapping quotes are dropped too, since they get pasted in by accident.
 */
function readVar(name: 'TRACKER_SUPABASE_URL' | 'TRACKER_SUPABASE_ANON_KEY'): string {
  const raw = import.meta.env[name] || (typeof process !== 'undefined' ? process.env[name] : '') || '';
  return String(raw)
    .trim()
    .replace(/^(["'])(.*)\1$/s, '$2')
    .trim();
}

/** Any secret or address replaced, so no message can carry the URL or the key. */
function redact(message: string, secrets: string[]): string {
  let out = message;
  for (const secret of secrets) if (secret.length > 3) out = out.split(secret).join('[redacted]');
  return out;
}

/** "TypeError: fetch failed (cause: Error: getaddrinfo ENOTFOUND [redacted])", redacted. */
function describeError(error: unknown, secrets: string[]): string {
  const one = (e: unknown): string =>
    e instanceof Error
      ? `${e.name}: ${e.message}${'code' in e && e.code ? ` [${String(e.code)}]` : ''}`
      : String(e);
  const cause = error instanceof Error && error.cause ? ` (cause: ${one(error.cause)})` : '';
  return redact(one(error) + cause, secrets);
}

type Endpoint = { ok: true; url: string; secrets: string[] } | { ok: false; reason: string };

/**
 * The REST address, or the reason there isn't one. Trailing slashes are dropped,
 * and a URL that already ends in /rest/v1 does not get it twice. Nothing in a
 * reason repeats the value.
 */
function endpointFrom(rawUrl: string): Endpoint {
  const trimmed = rawUrl.replace(/\/+$/, '');
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      ok: false,
      reason: 'TRACKER_SUPABASE_URL is not a valid URL. It does not parse, so check that it starts with https://.',
    };
  }
  if (parsed.protocol !== 'https:') {
    return {
      ok: false,
      reason: `TRACKER_SUPABASE_URL is not a valid https URL. Its protocol is ${parsed.protocol}`,
    };
  }
  const base = /\/rest\/v1$/i.test(trimmed) ? trimmed : `${trimmed}/rest/v1`;
  const url =
    `${base}/events?select=${COLUMNS}&featured=eq.true&order=start_at.asc,luma_uid.asc&limit=${LIMIT}`;
  return { ok: true, url, secrets: [url, base, trimmed, parsed.host, parsed.hostname] };
}

async function fetchEvents(): Promise<EventItem[]> {
  const rawUrl = readVar('TRACKER_SUPABASE_URL');
  const key = readVar('TRACKER_SUPABASE_ANON_KEY');

  const missing = [!rawUrl && 'TRACKER_SUPABASE_URL', !key && 'TRACKER_SUPABASE_ANON_KEY'].filter(Boolean);
  if (missing.length > 0) {
    warn(`${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not set.`);
    return [];
  }

  const endpoint = endpointFrom(rawUrl);
  if (!endpoint.ok) {
    warn(endpoint.reason);
    return [];
  }
  const secrets = [key, ...endpoint.secrets];

  try {
    const res = await fetch(endpoint.url, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = redact((await res.text().catch(() => '')).slice(0, 200), secrets);
      warn(`The tracker answered HTTP ${res.status}: ${body || '(empty body)'}`);
      return [];
    }

    const body: unknown = await res.json();
    if (!Array.isArray(body)) {
      warn('The tracker returned something other than a list.');
      return [];
    }

    const mapped = mapRows(body);
    for (const line of summarize(body.length, mapped, new Date(), describeKey(key))) console.log(line);
    return mapped.items;
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
    warn(
      timedOut
        ? `The request timed out after ${TIMEOUT_MS / 1000} seconds. ${describeError(error, secrets)}.`
        : `The request threw ${describeError(error, secrets)}.`,
    );
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
