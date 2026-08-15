/**
 * Standalone photo slots: the ones that are not attached to an issue or an
 * event row (those carry their own `image` field in issues.ts and events.ts).
 *
 * To drop a real photo in: put the file at the path below and change `src`
 * from null to that path. One edit, one slot. Nothing else moves, because the
 * frame is already rendering at the final aspect ratio.
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
} as const satisfies Record<string, PhotoSlot>;

/** Where each slot's file belongs, printed inside the empty slot. */
export const photoPaths = {
  homeHero: '/images/home/hero.jpg',
} as const satisfies Record<keyof typeof photos, string>;
