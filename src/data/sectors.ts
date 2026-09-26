/**
 * The sectors on the home hero's map. SectorMap reads this file and nothing
 * else, so the list can be edited here without touching the component.
 *
 * ============================================================================
 *  PLACEHOLDERS. These four sectors and their neighbourhoods are a working
 *  list until Brandon confirms the final one. Replace them here when he does.
 * ============================================================================
 *
 * Coordinates are in the map's own 340 x 300 viewBox, not in pixels, so they
 * hold at every size the map renders at. `label` is the side of the dot the
 * neighbourhood name sits on; pick the side that points away from the other
 * dots and from the edge of the map.
 *
 * Sectors light up in the order they are listed, and within a sector the dots
 * appear in the order they are listed. Each dot after the first draws a line
 * from the nearest dot already on in its sector, so reordering the places
 * changes which lines are drawn. See design-system.md §21.
 *
 * Everything here renders on the page, so the copy rules apply: no em dashes,
 * and no names that are not real places.
 */

import { site } from '../lib/site';

export type LabelSide = 'top' | 'right' | 'bottom' | 'left';

export interface Place {
  name: string;
  /** 0 to 340, in the map's viewBox. */
  x: number;
  /** 0 to 300, in the map's viewBox. */
  y: number;
  label: LabelSide;
}

export interface Sector {
  /** Shown large in the caption while the sector is lit. */
  name: string;
  places: Place[];
}

export const sectors: Sector[] = [
  {
    name: 'Mediatech',
    places: [
      { name: 'Hollywood', x: 178, y: 112, label: 'top' },
      { name: 'Burbank', x: 198, y: 72, label: 'top' },
      { name: 'Culver City', x: 152, y: 170, label: 'right' },
    ],
  },
  {
    name: 'Hardtech',
    places: [
      { name: 'El Segundo', x: 134, y: 212, label: 'left' },
      { name: 'Hawthorne', x: 160, y: 204, label: 'right' },
      { name: 'Long Beach', x: 224, y: 254, label: 'right' },
    ],
  },
  {
    name: 'Biotech',
    places: [
      { name: 'Westwood', x: 126, y: 126, label: 'top' },
      { name: 'Downtown', x: 212, y: 152, label: 'right' },
      { name: 'Pasadena', x: 268, y: 92, label: 'top' },
    ],
  },
  {
    name: 'AI and software',
    places: [
      { name: 'Santa Monica', x: 100, y: 146, label: 'left' },
      { name: 'Playa Vista', x: 118, y: 184, label: 'left' },
    ],
  },
];

/**
 * The caption once every sector is on. It is also what the server renders, so
 * it is the whole map for a visitor with reduced motion or no JavaScript.
 * 15K+ is the one verified number, read from site.ts rather than retyped.
 */
export const mapFinale = {
  name: 'Los Angeles',
  line: `${site.communitySize} builders across every sector`,
} as const;
