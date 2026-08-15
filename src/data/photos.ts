/**
 * Standalone photo slots: the ones that are not attached to an issue or an
 * event row (those carry their own `image` field in issues.ts and events.ts).
 *
 * To drop a real photo in: put the file at the matching path in `photoPaths`
 * below and change `src` from null to that path. One edit, one slot. Nothing
 * else moves, because the frame is already rendering at the final aspect ratio.
 *
 * Set `alt` at the same time. It is required as soon as `src` is set.
 */

export interface PhotoSlot {
  /** Path under /public. Null means the slot renders empty. */
  src: string | null;
  /** Required once src is set. */
  alt: string;
  /** What the photo should be. Shown on the empty slot's caption bar. */
  brief: string;
}

export const photos = {
  homeHero: {
    src: null,
    alt: '',
    brief: 'Room at a dinner or a mixer, low light, nobody posing',
  },

  aboutPortrait: {
    src: null,
    alt: '',
    brief: 'Portrait, waist up, natural light, looking to camera',
  },

  /* The band on the About page. Three candid room shots from real events. */
  aboutRoom1: {
    src: null,
    alt: '',
    brief: 'Candid, full room mid-conversation, low light',
  },
  aboutRoom2: {
    src: null,
    alt: '',
    brief: 'Candid, two people talking, low light, nobody posing',
  },
  aboutRoom3: {
    src: null,
    alt: '',
    brief: 'Candid, back of the room, low light, nobody posing',
  },

  /* The band on the Events page. This is the page most likely to carry real
     event photography, so these three are the ones to fill first. */
  eventsRoom1: {
    src: null,
    alt: '',
    brief: 'Candid, full room at a dinner, low light, nobody posing',
  },
  eventsRoom2: {
    src: null,
    alt: '',
    brief: 'Candid, someone mid-sentence in a small group, low light',
  },
  eventsRoom3: {
    src: null,
    alt: '',
    brief: 'Candid, arrivals or the doorway, low light, nobody posing',
  },
} as const satisfies Record<string, PhotoSlot>;

/** Where each slot's file belongs, printed inside the empty slot. */
export const photoPaths = {
  homeHero: '/images/home/hero.jpg',
  aboutPortrait: '/images/about/founder-portrait.jpg',
  aboutRoom1: '/images/about/room-1.jpg',
  aboutRoom2: '/images/about/room-2.jpg',
  aboutRoom3: '/images/about/room-3.jpg',
  eventsRoom1: '/images/events/room-1.jpg',
  eventsRoom2: '/images/events/room-2.jpg',
  eventsRoom3: '/images/events/room-3.jpg',
} as const satisfies Record<keyof typeof photos, string>;
