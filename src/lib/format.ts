/**
 * Date formatting for display.
 *
 * Every function is null safe and returns a visible bracketed marker rather
 * than a guess, because the copy rules forbid invented dates. A null date is a
 * date nobody has confirmed yet, and it should look like one on the page.
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Parses YYYY-MM-DD without letting the local timezone shift the day. */
function parts(iso: string | null): [number, number, number] | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** "MAR", or "[MON]" when there is no date yet. */
export function monthShort(iso: string | null): string {
  const p = parts(iso);
  return p ? MONTHS[p[1] - 1].toUpperCase() : '[MON]';
}

/** "04", or "[??]" when there is no date yet. */
export function dayOfMonth(iso: string | null): string {
  const p = parts(iso);
  return p ? String(p[2]).padStart(2, '0') : '[??]';
}

/** "March 4, 2026", or "[DATE]" when there is no date yet. */
export function longDate(iso: string | null): string {
  const p = parts(iso);
  return p ? `${MONTHS_FULL[p[1] - 1]} ${p[2]}, ${p[0]}` : '[DATE]';
}

/** Machine readable value for <time datetime>, or undefined. */
export function machineDate(iso: string | null): string | undefined {
  return parts(iso) ? iso! : undefined;
}
