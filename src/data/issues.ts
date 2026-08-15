/**
 * Newsletter archive. Hand maintained.
 *
 * Add newest first. Nothing reads this from an API and nothing generates it;
 * when an issue goes out, it gets added here by hand.
 *
 * Copy rules apply to every string in this file. In particular: no invented
 * statistics, names or dates. See CLAUDE.md.
 *
 * The rows currently in here are PLACEHOLDERS, marked `placeholder: true`.
 * They exist so the home page and the archive have something to render. Delete
 * them as real issues arrive: `grep "placeholder: true"` finds all of them.
 */

export const ISSUE_CATEGORIES = [
  'Founder story',
  'Event recap',
  'Funding',
  'Hiring',
  'City',
  '[Category]',
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export interface Issue {
  /** URL-safe id, also the archive filter key. */
  slug: string;
  /** Sequential issue number as published. Null until it is known. */
  number: number | null;
  title: string;
  /** One line. Shown under the title in the archive list. */
  summary: string;
  /** ISO date, YYYY-MM-DD, the day it was sent. Null renders as [DATE]. */
  date: string | null;
  category: IssueCategory;
  /** Full URL of the issue on Beehiiv. Null falls back to the archive page. */
  url: string | null;
  /**
   * Path under /public, or null while there is no photo yet. Setting this is
   * the single edit that swaps a real photo into the card.
   */
  image: string | null;
  /** Alt text. Required whenever image is set. */
  imageAlt?: string;
  /** At most one issue may be featured. It gets the orange chip. */
  featured?: boolean;
  /** Scaffolding row. Delete when a real issue replaces it. */
  placeholder?: boolean;
}

export const issues: Issue[] = [
  {
    slug: 'placeholder-1',
    number: null,
    title: 'Inside the build with a $14M co-founder',
    summary: '',
    date: null,
    category: 'Founder story',
    url: null,
    image: null,
    featured: true,
    placeholder: true,
  },
  {
    slug: 'placeholder-2',
    number: null,
    title: '100+ VCs, angels and LPs showed up for this one',
    summary: '',
    date: null,
    category: 'Event recap',
    url: null,
    image: null,
    placeholder: true,
  },
  {
    slug: 'placeholder-3',
    number: null,
    title: '[Issue headline goes here]',
    summary: '',
    date: null,
    category: '[Category]',
    url: null,
    image: null,
    placeholder: true,
  },
];

/**
 * Newest first, which is the order the archive renders.
 * Undated rows sort to the front: an issue without a date is either the next
 * one out or a placeholder, and both belong at the top.
 */
export function sortedIssues(list: Issue[] = issues): Issue[] {
  return [...list].sort((a, b) => (b.date ?? '9999').localeCompare(a.date ?? '9999'));
}

/** The n most recent issues, for the home page. */
export function latestIssues(count: number, list: Issue[] = issues): Issue[] {
  return sortedIssues(list).slice(0, count);
}

/** Categories that actually have issues, for the archive filter row. */
export function usedCategories(list: Issue[] = issues): IssueCategory[] {
  const present = new Set(list.map((i) => i.category));
  return ISSUE_CATEGORIES.filter((c) => present.has(c));
}
