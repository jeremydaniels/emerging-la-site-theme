/**
 * Standalone photo slots: the ones that are not attached to an issue or an
 * event row (those carry their own `image` field in issues.ts and events.ts).
 *
 * To drop a real photo in: put the file at the matching path in `photoPaths`
 * below and change `src` from null to that path. One edit, one slot. Nothing
 * else moves, because the frame is already rendering at the final aspect ratio.
 *
 * Set `alt` at the same time. It is required as soon as `src` is set.
 *
 * ALT IS OUTSTANDING ON EVERY FILLED SLOT. The seven photos below are wired
 * up and their alt is still the empty string, which tells a screen reader the
 * image is decorative. These are not decorative. The copy is being written
 * separately; until it lands this is a known accessibility gap, not a slot
 * that was forgotten.
 *
 * Two files are `.jpeg`, not `.jpg`: band-room and room-2. The paths below are
 * what is actually on disk. Rename the files and these two strings together or
 * neither, or the slot 404s.
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
  /* The hero photo, full content width under the headline block. 3/2 on the
     `band` preset, the same one the About and events bands use, so one export
     size covers every standalone photo on the site. */
  homeHero: {
    src: '/images/home/hero.jpg',
    alt: '',
    brief: 'A full room at an event, shot wide, people mid-conversation, nobody posing',
  },

  aboutPortrait: {
    src: null,
    alt: '',
    brief: 'Portrait, waist up, natural light, looking to camera',
  },

  /* The band on the About page, between the purpose block and what we do.
     The crowd, the conversation, the city. All 3/2 landscape, the same preset
     the events band uses, so they line up across on wide and stack cleanly on
     narrow. The founder portrait above is the page's only 4/5 frame. */
  aboutBandRoom: {
    src: '/images/about/band-room.jpeg',
    alt: '',
    brief:
      'A full room at an ELA event, wide, shot from the back or side so it reads as a crowd',
  },
  aboutBandPeople: {
    src: '/images/about/band-people.jpg',
    alt: '',
    brief: 'Two or three people talking at an event, close, natural light',
  },
  aboutBandCity: {
    src: '/images/about/band-city.jpg',
    alt: '',
    brief: 'Los Angeles itself, exterior, recognisable as LA without being a postcard',
  },

  /* The band on the Events page. This is the page most likely to carry real
     event photography, so these three are the ones to fill first. */
  eventsRoom1: {
    src: '/images/events/room-1.jpg',
    alt: '',
    brief: 'Candid, full room at a dinner, low light, nobody posing',
  },
  eventsRoom2: {
    src: '/images/events/room-2.jpeg',
    alt: '',
    brief: 'Candid, someone mid-sentence in a small group, low light',
  },
  eventsRoom3: {
    src: '/images/events/room-3.jpg',
    alt: '',
    brief: 'Candid, arrivals or the doorway, low light, nobody posing',
  },
} as const satisfies Record<string, PhotoSlot>;

/** Where each slot's file belongs, printed inside the empty slot. */
export const photoPaths = {
  homeHero: '/images/home/hero.jpg',
  aboutPortrait: '/images/about/founder-portrait.jpg',
  aboutBandRoom: '/images/about/band-room.jpeg',
  aboutBandPeople: '/images/about/band-people.jpg',
  aboutBandCity: '/images/about/band-city.jpg',
  eventsRoom1: '/images/events/room-1.jpg',
  eventsRoom2: '/images/events/room-2.jpeg',
  eventsRoom3: '/images/events/room-3.jpg',
} as const satisfies Record<keyof typeof photos, string>;
