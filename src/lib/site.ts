/** Site-wide constants used by layouts and metadata. */

/**
 * The one real number we are allowed to state. See CLAUDE.md, copy rules.
 *
 * THIS IS THE ONLY PLACE IT IS SET. Every stat, sentence and caption reads it
 * from here, through `community` or `site.communitySize`. `count` is in
 * thousands and `unit` is what follows it. A live subscriber count from
 * Beehiiv on a daily rebuild is a change to `count` alone, for example
 * `Math.floor(subscribers / 1000)`.
 */
export const community = {
  count: 15,
  unit: 'K+',
} as const;

export const site = {
  name: 'Emerging LA',
  /** `community` as one string, for running text: "15K+". */
  communitySize: `${community.count}${community.unit}`,
  location: 'Los Angeles, California',
  description:
    'A newsletter and events for the people building tech in Los Angeles.',
  url: 'https://emergingla.com',
} as const;

/**
 * The About page's opening, split at the point the home page stops.
 *
 * Home shows the headline, `lead`, an ellipsis and a link to /about.
 * About shows the headline, then `lead + rest` as one paragraph.
 *
 * `lead` therefore ends mid-sentence with no punctuation, and `rest` opens
 * with the period that finishes it. Joining them is plain concatenation and
 * the seam takes no handling at either end.
 */
export const aboutOpening = {
  headline: 'LA has always built the hard stuff.',
  lead:
    'When someone mentions Los Angeles, you might think "film." But then, you might also' +
    " think rockets, aircraft, and games. The city's habit is taking on things that don't" +
    ' work yet and building them anyway',
  rest:
    ". That hasn't changed. What's changed is who's doing it, and how hard it is to find" +
    ' them.',
} as const;

/** Nav links. Subscribe is deliberately not in here: it is an action, not a link. */
export const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Archive', href: '/archive' },
  { label: 'Events', href: '/events' },
] as const;
