/**
 * Warns about events still flagged `upcoming` whose date has already passed.
 *
 * `status` in src/data/events.ts is set by hand and is deliberately not derived
 * from the date, so nothing flips it automatically. This is the reminder.
 *
 * Runs as part of `npm run build`. It warns; it never fails the build. Pass
 * --strict to make it exit non-zero instead.
 */

import { staleUpcoming, events } from '../src/data/events.ts';

const strict = process.argv.includes('--strict');
const stale = staleUpcoming(events);

if (stale.length === 0) {
  console.log(`[events] ${events.length} event(s), no stale upcoming flags.`);
  process.exit(0);
}

console.warn(
  `\n[events] ${stale.length} event(s) are still flagged "upcoming" but the date has passed.` +
    `\n[events] Open src/data/events.ts and change status to "past":\n`,
);
for (const e of stale) {
  console.warn(`  · ${e.date}  ${e.slug}  (${e.name})`);
}
console.warn('');

process.exit(strict ? 1 : 0);
