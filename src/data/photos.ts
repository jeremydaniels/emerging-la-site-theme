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
  /**
   * The photo. On a filled slot this describes the one that is in there; on an
   * empty slot it describes the one that should go in, and renders on the slot's
   * caption bar. Emptying a filled slot therefore turns its brief back into a
   * spec for the replacement, which is why these are kept true to the picture
   * rather than to the original wish list.
   */
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
     All 3/2 landscape, the same preset the events band uses, so they line up
     across on wide and stack cleanly on narrow. The founder portrait above is
     the page's only 4/5 frame.

     The keys were named for what was specified, the crowd, the conversation
     and the city. Two of the three photos that landed are something else, and
     aboutBandCity in particular holds a group at a doorway and no city at all.
     The briefs below describe the pictures; the keys and the file names still
     describe the wish list. Renaming them is a rename of the files, these
     keys, photoPaths and about.astro together, so it has not been done here. */
  aboutBandRoom: {
    src: '/images/about/band-room.jpeg',
    alt: '',
    brief: 'A large group posed together indoors, warm light, the group filling the frame',
  },
  aboutBandPeople: {
    src: '/images/about/band-people.jpg',
    alt: '',
    brief: 'A long table mid-meal, people talking down both sides, daylight from the garden behind',
  },
  aboutBandCity: {
    src: '/images/about/band-city.jpg',
    alt: '',
    brief: 'Five people posed in a doorway, red lanterns overhead, greenery behind them',
  },

  /* The band on the Events page. All three are posed group photographs rather
     than the candids that were specified. The briefs say so. */
  eventsRoom1: {
    src: '/images/events/room-1.jpg',
    alt: '',
    brief: 'A large group posed outdoors around a fire pit, daylight, hedge behind',
  },
  eventsRoom2: {
    src: '/images/events/room-2.jpeg',
    alt: '',
    brief: 'A large group posed together at a bar, warm indoor light',
  },
  eventsRoom3: {
    src: '/images/events/room-3.jpg',
    alt: '',
    brief: 'Three people posed in black tie, dark room, red uplight, a crowd behind them',
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
