/**
 * Newsletter archive.
 *
 * ============================================================================
 *  SHAPED FOR THE BEEHIIV SWAP
 *
 *  `Issue` carries exactly six fields, and they are all things a Beehiiv post
 *  can give us: id, title, category, date, url, image. Nothing on any page
 *  reads or writes a field outside that shape, so moving to the API is
 *  replacing the body of `getIssues()` with a fetch. It is already async for
 *  that reason: callers await it today, so they will not change.
 *
 *  Do not add presentational fields here. Anything a page needs that Beehiiv
 *  cannot supply belongs in the page or the component, not on the record.
 *  In particular there is deliberately no `featured` flag: which card carries
 *  the accent is a view decision, recalculated per filter, not a property of
 *  an issue.
 * ============================================================================
 *
 * The rows below are placeholders. Every one has `url: null`, which is the
 * marker: a real issue always has a Beehiiv URL. The first three carry real
 * thumbnail artwork and the headlines that go with it; the rest are bracketed
 * so nothing there can be mistaken for a real headline.
 *
 * Thumbnails live under `/images/issues/`, exported at Beehiiv's 1200 x 630 so
 * the card well holds them uncropped.
 */

export interface Issue {
  /** Stable id. Beehiiv's post id once this is live. */
  id: string;
  title: string;
  /** Free-form so an API tag maps straight onto it. Drives the filters. */
  category: string;
  /** ISO date, YYYY-MM-DD. Null renders as [DATE] rather than a guess. */
  date: string | null;
  /** Full URL of the issue on Beehiiv. Null while there is not one. */
  url: string | null;
  /** Path under /public. Setting this is the single edit that swaps in a photo. */
  image: string | null;
}

const ISSUES: Issue[] = [
  {
    id: 'placeholder-issue-1',
    title: '96 women showed up to a mixer with zero pitch decks',
    category: 'Event recap',
    date: null,
    url: null,
    image: '/images/issues/issue-1.jpg',
  },
  {
    id: 'placeholder-issue-2',
    title: "Inside the dinner series nobody's allowed to post about",
    category: 'Event recap',
    date: null,
    url: null,
    image: '/images/issues/issue-2.jpg',
  },
  {
    id: 'placeholder-issue-3',
    title: 'Why a fintech founder traded San Francisco for Venice Beach',
    category: 'Founder story',
    date: null,
    url: null,
    image: '/images/issues/issue-3.jpg',
  },
  {
    id: 'placeholder-01',
    title: 'Inside the build with a $14M co-founder',
    category: 'Founder story',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-02',
    title: '100+ VCs, angels and LPs showed up for this one',
    category: 'Event recap',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-03',
    title: '[Issue headline three]',
    category: 'Funding',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-04',
    title: '[Issue headline four]',
    category: 'Founder story',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-05',
    title: '[Issue headline five]',
    category: 'Event recap',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-06',
    title: '[Issue headline six]',
    category: 'Hiring',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-07',
    title: '[Issue headline seven]',
    category: 'Funding',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-08',
    title: '[Issue headline eight]',
    category: 'Hiring',
    date: null,
    url: null,
    image: null,
  },
  {
    id: 'placeholder-09',
    title: '[Issue headline nine]',
    category: 'Founder story',
    date: null,
    url: null,
    image: null,
  },
];

/**
 * THE ONE READ POINT. Every page goes through here.
 *
 * To move to Beehiiv, replace the body with the fetch and map the response
 * onto `Issue`. No caller changes, because this is already async and already
 * returns the sorted list.
 *
 * Newest first. Undated issues sort to the front: an issue without a date is
 * either the next one out or a placeholder, and both belong at the top.
 */
export async function getIssues(): Promise<Issue[]> {
  return [...ISSUES].sort((a, b) => (b.date ?? '9999').localeCompare(a.date ?? '9999'));
}

/** The n most recent, for the home page. */
export async function getLatestIssues(count: number): Promise<Issue[]> {
  return (await getIssues()).slice(0, count);
}

/**
 * The categories actually present, in first-seen order, for the filter row.
 * Derived from the data rather than a hardcoded union, so whatever tags
 * Beehiiv returns become the filters with no further edit.
 */
export function categoriesOf(issues: Issue[]): string[] {
  return [...new Set(issues.map((issue) => issue.category))];
}
