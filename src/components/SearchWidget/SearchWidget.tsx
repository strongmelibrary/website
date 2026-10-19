import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BOOKWORM_API_URL,
  BOOKWORM_LIBRARY_SLUG,
  BOOKWORM_PASSWORD,
  BOOKWORM_USERNAME,
  SEARCH_DOWN_CTA_TEXT,
  SEARCH_DOWN_CTA_URL,
} from '../../config';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { HiBookOpen, HiDeviceTablet, HiExclamationCircle } from 'react-icons/hi2';
import { TbExternalLink } from 'react-icons/tb';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type MediaTypeFilter = 'combined' | 'physical' | 'digital';
type SortOption = 'relevance' | 'availability' | 'title' | 'author';

interface UnifiedResult {
  id: string;
  title: string;
  author: string;
  description: string;
  mediaType: 'physical' | 'digital';
  imageUrl: string | null;
  availability: string;
  copies: number;
  format: string;
  source: 'legacy' | 'ycl';
  sourceId: string;
  additionalDetails: Record<string, unknown>;
}

interface PageMeta {
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  mediaTypeCounts: { physical: number; digital: number };
}

interface SearchResults {
  meta: PageMeta;
  results: UnifiedResult[];
}

interface SearchWidgetProps {
  showResultsInline?: boolean;
}

interface DetailRow {
  label: string;
  value: string;
}

type HealthStatus = 'unknown' | 'ok' | 'down';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const PAGE_SIZE = 10;

const MEDIA_FILTERS: Array<{ value: MediaTypeFilter; label: string }> = [
  { value: 'combined', label: 'All' },
  { value: 'physical', label: 'Print' },
  { value: 'digital', label: 'Digital' },
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'availability', label: 'Availability' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
];

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]';

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const isHttpUrl = (value: unknown): value is string =>
  typeof value === 'string' && /^https?:\/\//i.test(value);

/**
 * Legacy (print) covers come back as a relative `cover_server.php?...` path and
 * must be resolved against the OPAC base URL. Digital covers are already absolute.
 */
const resolveImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const base = SEARCH_DOWN_CTA_URL.replace(/\/+$/, '');
  return base ? `${base}/${imageUrl.replace(/^\/+/, '')}` : null;
};

const formatDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/** Build the key/value rows shown under each result, for either media type. */
const getDetailRows = (item: UnifiedResult): DetailRow[] => {
  const details = item.additionalDetails ?? {};

  if (item.mediaType === 'physical' || item.source === 'legacy') {
    const extraFields = (details.extraFields ?? {}) as Record<string, string>;
    return Object.entries(extraFields)
      .filter(([, value]) => value !== null && value !== undefined && `${value}`.length > 0)
      .map(([label, value]) => ({ label, value: `${value}` }));
  }

  const rows: DetailRow[] = [];
  if (details.publisher) rows.push({ label: 'Publisher', value: `${details.publisher}` });
  const published = formatDate(details.publishDate);
  if (published) rows.push({ label: 'Published', value: published });
  if (details.seriesTitle) rows.push({ label: 'Series', value: `${details.seriesTitle}` });
  if (details.isbn) rows.push({ label: 'ISBN', value: `${details.isbn}` });
  if (details.language) rows.push({ label: 'Language', value: `${details.language}`.toUpperCase() });
  return rows;
};

const isAvailable = (item: UnifiedResult): boolean =>
  item.availability?.toLowerCase().startsWith('available') ?? false;

const formatBadgeClass = (mediaType: UnifiedResult['mediaType']): string =>
  mediaType === 'digital'
    ? 'bg-[var(--color-forest)]/10 text-[var(--color-forest)] border-[var(--color-forest)]/25'
    : 'bg-[var(--color-parchment)] text-[var(--color-terracotta)] border-[var(--color-stone)]/50';

const availabilityBadgeClass = (available: boolean): string =>
  available
    ? 'bg-[var(--color-success-light)] text-[var(--color-success-dark)] border-[var(--color-success)]/25'
    : 'bg-[var(--color-warning-light)] text-[var(--color-warning-dark)] border-[var(--color-warning)]/25';

/* ─── Component ─────────────────────────────────────────────────────────── */

const SearchWidget: React.FC<SearchWidgetProps> = ({ showResultsInline = false }) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('unknown');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaType, setMediaType] = useState<MediaTypeFilter>('combined');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [counts, setCounts] = useState<PageMeta['mediaTypeCounts'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guards against out-of-order responses when filters are changed quickly.
  const requestIdRef = useRef(0);

  const healthCheckUrl = `${BOOKWORM_API_URL}/health`;
  const searchUrl = `${BOOKWORM_API_URL}/api/search`;
  const ctaUrl = SEARCH_DOWN_CTA_URL;
  const hasDigitalLibrary = BOOKWORM_LIBRARY_SLUG.trim().length > 0;

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      try {
        const response = await fetch(healthCheckUrl);
        if (cancelled) return;
        if (!response.ok) {
          setHealthStatus('down');
          return;
        }
        const data: { status?: string } = await response.json();
        setHealthStatus(data.status === 'ok' ? 'ok' : 'down');
      } catch {
        if (!cancelled) setHealthStatus('down');
      }
    };

    checkHealth();
    return () => {
      cancelled = true;
    };
  }, [healthCheckUrl]);

  const performSearch = useCallback(
    async (query: string, page: number = 1, type: MediaTypeFilter = 'combined', sort: SortOption = 'relevance') => {
      if (!query.trim()) return;

      const requestId = ++requestIdRef.current;

      if (typeof window !== 'undefined' && showResultsInline) {
        const url = new URL(window.location.href);
        url.searchParams.set('q', query);
        url.searchParams.set('page', page.toString());
        if (type !== 'combined') url.searchParams.set('mediaType', type);
        else url.searchParams.delete('mediaType');
        if (sort !== 'relevance') url.searchParams.set('sortBy', sort);
        else url.searchParams.delete('sortBy');
        window.history.pushState({ path: url.toString() }, '', url.toString());
      }

      setIsLoading(true);
      setCurrentQuery(query);
      setCurrentPage(page);
      setError(null);

      const queryParams = new URLSearchParams({
        search: query,
        username: BOOKWORM_USERNAME,
        page: page.toString(),
        pageSize: PAGE_SIZE.toString(),
        mediaType: type,
        sortBy: sort,
        version: 'v2',
      });
      if (BOOKWORM_PASSWORD) queryParams.append('password', BOOKWORM_PASSWORD);
      if (hasDigitalLibrary) queryParams.append('librarySlug', BOOKWORM_LIBRARY_SLUG.trim());

      try {
        const response = await fetch(`${searchUrl}?${queryParams.toString()}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || `Search failed (${response.status})`);
        }
        const data: SearchResults = await response.json();
        if (requestId !== requestIdRef.current) return;

        const rawResults = Array.isArray(data?.results) ? data.results : [];
        const meta: PageMeta = data?.meta ?? {
          currentPage: page,
          pageSize: PAGE_SIZE,
          totalResults: rawResults.length,
          totalPages: rawResults.length > 0 ? 1 : 0,
          mediaTypeCounts: { physical: 0, digital: 0 },
        };
        const pageSize = meta.pageSize || PAGE_SIZE;
        // The Bookworm API does not apply offset/limit to the digital (YCL)
        // results, so a page can come back with the whole result set. Trim to
        // the requested window whenever the response over-returns; leave
        // correctly paginated responses untouched.
        const results =
          rawResults.length > pageSize
            ? rawResults.slice((page - 1) * pageSize, page * pageSize)
            : rawResults;

        setSearchResults({ meta, results });
        setHealthStatus('ok');

        // `mediaTypeCounts` is only accurate for the sources that were queried.
        const nextCounts = meta.mediaTypeCounts;
        if (nextCounts) {
          if (type === 'combined') {
            setCounts(nextCounts);
          } else {
            // A filtered response only reports the type it queried; keep the
            // other type's last known count instead of zeroing it out.
            setCounts((prev) => (prev ? { ...prev, [type]: nextCounts[type] } : null));
          }
        }
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        if (err instanceof TypeError) {
          // Network-level failure — treat the service as unavailable.
          setHealthStatus('down');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch search results.');
        }
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    },
    [hasDigitalLibrary, searchUrl, showResultsInline],
  );

  // Hydrate from the URL on first load (results are linkable / shareable).
  useEffect(() => {
    if (typeof window === 'undefined' || !showResultsInline) return;

    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');
    if (!queryFromUrl) return;

    const pageFromUrl = parseInt(urlParams.get('page') || '1', 10);
    const mediaTypeFromUrl = urlParams.get('mediaType') as MediaTypeFilter | null;
    const sortFromUrl = urlParams.get('sortBy') as SortOption | null;

    const decodedQuery = decodeURIComponent(queryFromUrl);
    const initialType: MediaTypeFilter =
      mediaTypeFromUrl && MEDIA_FILTERS.some((f) => f.value === mediaTypeFromUrl)
        ? mediaTypeFromUrl
        : 'combined';
    const initialSort: SortOption =
      sortFromUrl && SORT_OPTIONS.some((o) => o.value === sortFromUrl) ? sortFromUrl : 'relevance';

    setSearchTerm(decodedQuery);
    setMediaType(initialType);
    setSortBy(initialSort);
    performSearch(decodedQuery, Number.isNaN(pageFromUrl) ? 1 : pageFromUrl, initialType, initialSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResultsInline]);

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!searchTerm.trim()) return;

      if (!showResultsInline) {
        window.location.href = `/catalog?q=${encodeURIComponent(searchTerm)}&page=1`;
      } else {
        performSearch(searchTerm, 1, mediaType, sortBy);
      }
    },
    [searchTerm, showResultsInline, performSearch, mediaType, sortBy],
  );

  const handleMediaTypeChange = (nextType: MediaTypeFilter) => {
    if (nextType === mediaType) return;
    setMediaType(nextType);
    if (currentQuery) performSearch(currentQuery, 1, nextType, sortBy);
  };

  const handleSortChange = (nextSort: SortOption) => {
    if (nextSort === sortBy) return;
    setSortBy(nextSort);
    if (currentQuery) performSearch(currentQuery, 1, mediaType, nextSort);
  };

  const handlePageChange = (newPage: number) => {
    if (currentQuery && newPage > 0 && newPage <= (searchResults?.meta.totalPages || 0)) {
      performSearch(currentQuery, newPage, mediaType, sortBy);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const retrySearch = () => {
    if (currentQuery) performSearch(currentQuery, currentPage, mediaType, sortBy);
  };

  const countFor = (value: MediaTypeFilter): number | null => {
    if (!counts) return null;
    if (value === 'physical') return counts.physical;
    if (value === 'digital') return counts.digital;
    return counts.physical + counts.digital;
  };

  /* ── Service unavailable ─────────────────────────────────────────────── */

  if (healthStatus === 'down') {
    return (
      <div className="p-4 border border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/10 rounded-lg">
        <p className="type-body-sm text-[var(--color-terracotta-dark)] mb-3">
          The on-site search service is currently unavailable.
        </p>
        <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          {SEARCH_DOWN_CTA_TEXT}
          <TbExternalLink aria-hidden="true" className="w-5 h-5" />
        </a>
      </div>
    );
  }

  const showResults = showResultsInline && searchResults !== null;

  return (
    <div className="search-widget my-4">
      <form onSubmit={handleFormSubmit} className="flex gap-0" role="search">
        <label htmlFor="catalog-search" className="sr-only">
          Search the library catalog
        </label>
        <input
          id="catalog-search"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search books, eBooks, audiobooks…"
          className={[
            'flex-grow p-2 min-h-[44px]',
            'border border-[var(--color-stone)]/50',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-forest)]',
            'bg-[var(--color-paper)]',
            'rounded-l',
          ].join(' ')}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className={[
            'bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark,#2d5040)]',
            'text-white font-bold py-2 px-4 min-h-[44px]',
            'transition duration-150 ease-in-out',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex flex-row items-center gap-2',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]',
            'rounded-r',
          ].join(' ')}
        >
          <PiMagnifyingGlassBold aria-hidden="true" className="relative top-[1px]" />
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {!showResultsInline && (
        <p className="type-body-xs text-[var(--color-charcoal)]/60 mt-2">
          Press Search to view print and digital titles in the catalog.
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 p-3 rounded border border-[var(--color-error)]/30 bg-[var(--color-error-light)]"
        >
          <HiExclamationCircle
            aria-hidden="true"
            className="w-5 h-5 flex-shrink-0 text-[var(--color-error-dark)]"
          />
          <div>
            <p className="type-body-sm text-[var(--color-error-dark)]">{error}</p>
            <button type="button" onClick={retrySearch} className="type-body-sm underline text-[var(--color-error-dark)] mt-1 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-error-dark)]">
              Try again
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center p-8" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-forest)]"></div>
          <span className="ml-3 type-body-md">Searching the catalog…</span>
        </div>
      )}

      {!isLoading && showResults && searchResults && (
        <section className="search-results mt-6" aria-label="Catalog search results">
          {searchResults.results.length > 0 ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="type-heading-sm text-[var(--color-charcoal)]">
                    {searchResults.meta.totalResults}{' '}
                    {searchResults.meta.totalResults === 1 ? 'result' : 'results'} for{' '}
                    <span className="text-[var(--color-terracotta)]">“{currentQuery}”</span>
                  </h2>
                  {counts && (
                    <p className="type-body-xs text-[var(--color-charcoal)]/60 mt-1">
                      {counts.physical} print · {counts.digital} digital
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {hasDigitalLibrary && (
                    <div
                      role="group"
                      aria-label="Filter results by format"
                      className="inline-flex rounded-lg border border-[var(--color-stone)]/40 bg-[var(--color-paper)] p-0.5"
                    >
                      {MEDIA_FILTERS.map((filter) => {
                        const active = filter.value === mediaType;
                        const count = countFor(filter.value);
                        return (
                          <button
                            key={filter.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => handleMediaTypeChange(filter.value)}
                            className={[
                              'px-3 py-1.5 rounded-md type-button-sm min-h-[36px] transition-colors',
                              FOCUS_RING,
                              active
                                ? 'bg-[var(--color-forest)] text-white'
                                : 'text-[var(--color-charcoal)]/70 hover:bg-[var(--color-stone)]/20',
                            ].join(' ')}
                          >
                            {filter.label}
                            {count !== null ? ` (${count})` : ''}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <label className="inline-flex items-center gap-2 type-body-sm text-[var(--color-charcoal)]/70">
                    <span>Sort</span>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as SortOption)}
                      className="p-1.5 pr-6 min-h-[36px] rounded border border-[var(--color-stone)]/50 bg-[var(--color-paper)] type-body-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-forest)]"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <ul className="mt-4 space-y-4">
                {searchResults.results.map((item) => {
                  const imageSrc = resolveImageUrl(item.imageUrl);
                  const available = isAvailable(item);
                  const details = getDetailRows(item);
                  const googlePreviewUrl = item.additionalDetails?.googlePreviewUrl;
                  const detailsUrl = item.additionalDetails?.detailsUrl;

                  return (
                    <li
                      key={item.id}
                      className="card p-4 md:p-5 flex gap-4 border border-[var(--color-stone)]/20"
                    >
                      <div className="flex-shrink-0 w-[72px] sm:w-[92px] md:w-[104px]">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={`Cover of ${item.title}`}
                            loading="lazy"
                            className="w-full aspect-[2/3] object-cover rounded border border-[var(--color-stone)]/30 shadow-sm bg-[var(--color-parchment)]"
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="w-full aspect-[2/3] rounded border border-[var(--color-stone)]/30 bg-[var(--color-parchment)] flex items-center justify-center text-[var(--color-stone)]"
                          >
                            <HiBookOpen className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border type-caps ${formatBadgeClass(item.mediaType)}`}
                          >
                            {item.mediaType === 'digital' ? (
                              <HiDeviceTablet aria-hidden="true" className="w-3.5 h-3.5" />
                            ) : (
                              <HiBookOpen aria-hidden="true" className="w-3.5 h-3.5" />
                            )}
                            {item.mediaType === 'digital' ? item.format || 'eBook' : 'Print book'}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border type-caps ${availabilityBadgeClass(available)}`}
                          >
                            {item.availability}
                            {item.copies > 0
                              ? ` (${item.copies} ${item.copies === 1 ? 'copy' : 'copies'})`
                              : ''}
                          </span>
                        </div>

                        <h3 className="type-heading-xs text-[var(--color-charcoal)] leading-snug">
                          {item.title}
                        </h3>
                        {item.author && item.author !== 'Unknown Author' && (
                          <p className="type-body-sm text-[var(--color-charcoal)]/70 mt-0.5">
                            {item.author}
                          </p>
                        )}

                        {item.description && (
                          <p className="type-body-sm text-[var(--color-charcoal)]/70 mt-2 line-clamp-4">
                            {item.description}
                          </p>
                        )}

                        {details.length > 0 && (
                          <dl className="mt-3 pt-3 border-t border-[var(--color-stone)]/25 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 type-body-xs">
                            {details.map((row) => (
                              <div key={row.label} className="flex gap-1.5">
                                <dt className="font-bold text-[var(--color-charcoal)]/80 whitespace-nowrap">
                                  {row.label}
                                </dt>
                                <dd className="text-[var(--color-charcoal)]/70 min-w-0">{row.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                          {item.mediaType === 'digital' && isHttpUrl(detailsUrl) && (
                            <a
                              href={detailsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 type-body-sm font-bold underline text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]`}
                            >
                              Borrow in CloudLibrary
                              <TbExternalLink aria-hidden="true" className="w-4 h-4" />
                            </a>
                          )}
                          {item.mediaType === 'physical' && isHttpUrl(googlePreviewUrl) && (
                            <a
                              href={googlePreviewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 type-body-sm underline text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]`}
                            >
                              Google Preview
                              <TbExternalLink aria-hidden="true" className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {searchResults.meta.totalPages > 1 && (
                <nav
                  aria-label="Search results pagination"
                  className="mt-6 flex flex-wrap justify-between items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 min-h-[44px] bg-[var(--color-paper)] border border-[var(--color-stone)]/30 rounded hover:bg-[var(--color-stone)]/20 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
                  >
                    &larr; Previous
                  </button>
                  <span className="type-body-sm text-[var(--color-charcoal)]">
                    Page {currentPage} of {searchResults.meta.totalPages} (
                    {searchResults.meta.totalResults} results)
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= searchResults.meta.totalPages}
                    className="px-4 py-2 min-h-[44px] bg-[var(--color-paper)] border border-[var(--color-stone)]/30 rounded hover:bg-[var(--color-stone)]/20 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
                  >
                    Next &rarr;
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div>
              <h2 className="type-heading-sm text-[var(--color-charcoal)]">
                No results found for{' '}
                <span className="text-[var(--color-terracotta)]">“{currentQuery}”</span>.
              </h2>
              <p className="type-body-sm text-[var(--color-charcoal)]/70 mt-2">
                Try a different spelling, a shorter search term, or the author’s last name.
              </p>
              <button
                className="btn btn-outline mt-4"
                aria-label={`Request the book "${currentQuery}"`}
                onClick={() => {
                  console.log('Request this book clicked for:', currentQuery);
                }}
              >
                Request this book
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SearchWidget;
