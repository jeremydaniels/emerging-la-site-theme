/**
 * Every URL that points off this site.
 *
 * All of these are placeholders. The real Luma, LinkedIn and Beehiiv URLs get
 * dropped in later; nothing else in the codebase should hardcode an external
 * URL, so swapping them is one edit here.
 */

export const links = {
  /** Beehiiv hosted subscribe endpoint. The /subscribe form posts here. */
  beehiivSubscribe: 'https://example.com/placeholder-beehiiv-subscribe',
  /** Beehiiv publication home, used by the archive as the read-more target. */
  beehiivPublication: 'https://example.com/placeholder-beehiiv',

  /** Luma calendar for the org. */
  lumaCalendar: 'https://example.com/placeholder-luma',

  linkedin: 'https://example.com/placeholder-linkedin',
  instagram: 'https://example.com/placeholder-instagram',
  x: 'https://example.com/placeholder-x',

  email: 'mailto:hello@example.com',
} as const satisfies Record<string, string>;

export type LinkKey = keyof typeof links;

/** Internal routes, so a rename is one edit. */
export const routes = {
  home: '/',
  about: '/about',
  archive: '/archive',
  events: '/events',
  subscribe: '/subscribe',
  thanks: '/thanks',
  privacy: '/privacy',
  terms: '/terms',
} as const satisfies Record<string, string>;

export type RouteKey = keyof typeof routes;

/** True for anything that leaves the site, so link components can add rel/target. */
export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');
}
