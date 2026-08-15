/**
 * Newsletter archive. Hand maintained.
 *
 * Add newest first. Nothing reads this from an API and nothing generates it;
 * when an issue goes out, it gets added here by hand.
 *
 * Copy rules apply to every string in this file. In particular: no invented
 * statistics, names or dates. See CLAUDE.md.
 */

export const ISSUE_CATEGORIES = [
  'Founder story',
  'Event recap',
  'Funding',
  'Hiring',
  'City',
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export interface Issue {
  /** URL-safe id, also the archive filter key. */
  slug: string;
  /** Sequential issue number as published. */
  number: number;
  title: string;
  /** One line. Shown under the title in the archive list. */
  summary: string;
  /** ISO date, YYYY-MM-DD, the day it was sent. */
  date: string;
  category: IssueCategory;
  /** Full URL of the issue on Beehiiv. */
  url: string;
  /** Path under /public, or null while there is no photo yet. */
  image: string | null;
  /** Alt text. Required whenever image is set. */
  imageAlt?: string;
  /** At most one issue may be featured. It gets the orange chip. */
  featured?: boolean;
}

export const issues: Issue[] = [
  // Real issues go here, newest first. Example of the shape:
  //
  // {
  //   slug: 'issue-name',
  //   number: 1,
  //   title: '',
  //   summary: '',
  //   date: '2026-01-01',
  //   category: 'Founder story',
  //   url: 'https://...',
  //   image: '/images/issues/issue-name.jpg',
  //   imageAlt: '',
  //   featured: false,
  // },
];

/** Newest first, which is the order the archive renders. */
export function sortedIssues(list: Issue[] = issues): Issue[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

/** Categories that actually have issues, for the archive filter row. */
export function usedCategories(list: Issue[] = issues): IssueCategory[] {
  const present = new Set(list.map((i) => i.category));
  return ISSUE_CATEGORIES.filter((c) => present.has(c));
}
