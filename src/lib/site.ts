/** Site-wide constants used by layouts and metadata. */

export const site = {
  name: 'Emerging LA',
  /** The one real number we are allowed to state. See CLAUDE.md, copy rules. */
  communitySize: '15K+',
  location: 'Los Angeles, California',
  description:
    'A newsletter and events for the people building tech in Los Angeles.',
  url: 'https://emergingla.com',
} as const;

/** Nav links. Subscribe is deliberately not in here: it is an action, not a link. */
export const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Archive', href: '/archive' },
  { label: 'Events', href: '/events' },
] as const;
