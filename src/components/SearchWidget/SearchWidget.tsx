import React, { useState, useEffect, useCallback } from 'react';
import {
  BOOKWORM_API_URL,
  SEARCH_DOWN_CTA_URL,
  BOOKWORM_USERNAME,
  BOOKWORM_PASSWORD,
  SEARCH_DOWN_CTA_TEXT,
} from '../../config';
import { PiMagnifyingGlassBold } from 'react-icons/pi';

interface SearchWidgetProps {
  showResultsInline?: boolean;
}

interface HealthStatus {
  status: string;
}

interface SearchResultItem {
  bookJacketUrl?: string | null;
  googlePreviewUrl?: string | null;
  title: string;
  expandedAuthor: string;
  author?: string | null;
  extraFields: Record<string, string>;
  description: string;
  availability: string;
  copies: number;
}

interface PageMeta {
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
}

interface SearchResults {
  meta: PageMeta;
  results: SearchResultItem[];
}


const SearchWidget: React.FC<SearchWidgetProps> = ({ showResultsInline = false }) => {
  const [isServiceHealthy, setIsServiceHealthy] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const healthCheckUrl = `${BOOKWORM_API_URL}/health`;
  const searchUrl = `${BOOKWORM_API_URL}/api/scrape`;
  const ctaUrl = SEARCH_DOWN_CTA_URL;

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(healthCheckUrl);
        if (response.ok) {
          const data: HealthStatus = await response.json();
          setIsServiceHealthy(data.status === 'ok');
        } else {
          setIsServiceHealthy(false);
        }
      } catch (err) {
        console.error('Health check failed:', err);
        setIsServiceHealthy(false);
      }
    };
    checkHealth();
  }, [healthCheckUrl]);

  const performSearch = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    if (typeof window !== 'undefined' && showResultsInline) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      url.searchParams.set('page', page.toString());
      window.history.pushState({ path: url.toString() }, '', url.toString());
    }

    setIsLoading(true);
    setCurrentQuery(query);
    setCurrentPage(page);
    setError(null);
    setSearchResults(null);
    
    if (showResultsInline) {
      setIsServiceHealthy(null);
    }

    const username = BOOKWORM_USERNAME;
    const password = BOOKWORM_PASSWORD;

    const queryParams = new URLSearchParams({
      search: query,
      username: username,
      page: page.toString(),
    });
    if (password) {
      queryParams.append('password', password);
    }

    try {
      const response = await fetch(`${searchUrl}?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        setIsServiceHealthy(false);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data: SearchResults = await response.json();
      setSearchResults(data);
      setIsServiceHealthy(true);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'Failed to fetch search results.');
      setIsServiceHealthy(false);
    } finally {
      setIsLoading(false);
    }
  }, [searchUrl, showResultsInline]);

  useEffect(() => {
    if (typeof window !== 'undefined' && showResultsInline) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryFromUrl = urlParams.get('q');
      const pageFromUrl = parseInt(urlParams.get('page') || '1', 10);

      if (queryFromUrl) {
        const decodedQuery = decodeURIComponent(queryFromUrl);
        setSearchTerm(decodedQuery);
        performSearch(decodedQuery, isNaN(pageFromUrl) ? 1 : pageFromUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResultsInline]);

  const handleFormSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    if (!showResultsInline) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchTerm)}&page=1`;
    } else {
      performSearch(searchTerm, 1);
    }
  }, [searchTerm, showResultsInline, performSearch]);

  const handlePageChange = (newPage: number) => {
    if (currentQuery && newPage > 0 && newPage <= (searchResults?.meta.totalPages || 0)) {
      performSearch(currentQuery, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render CTA if service is unhealthy
  if (isServiceHealthy === false) {
    return (
      <div className="p-4 border border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/10 rounded-lg">
        <p className="type-body-sm text-[var(--color-terracotta-dark)] mb-3">
          The on-site search service is currently unavailable.
        </p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          {SEARCH_DOWN_CTA_TEXT}
        </a>
      </div>
    );
  }

  return (
    <div className="search-widget my-4">
      <form onSubmit={handleFormSubmit} className="flex gap-0" role="search">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search the library catalog..."
          aria-label="Search library catalog"
          className={[
            "flex-grow p-2 min-h-[44px]",
            "border border-[var(--color-stone)]/50",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-forest)]",
            "bg-[var(--color-paper)]",
            "rounded-l",
          ].join(' ')}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className={[
            "bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark,#2d5040)]",
            "text-white font-bold py-2 px-4 min-h-[44px]",
            "transition duration-150 ease-in-out",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex flex-row items-center gap-2",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]",
            "rounded-r",
          ].join(' ')}
        >
          {(isLoading || isServiceHealthy === null) ? 'Searching...' : (
            <>
              <PiMagnifyingGlassBold aria-hidden="true" className="relative top-[1px]" />
              Search
            </>
          )}
        </button>
      </form>

      {error && <p className="text-[var(--color-error)] mt-2 type-body-sm">Error: {error}</p>}

      {(isLoading || isServiceHealthy === null) && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-forest)]"></div>
          <span className="ml-3 type-body-md">Loading...</span>
        </div>
      )}

      {showResultsInline && searchResults && (
        <div className="search-results mt-4">
          <h3 className="type-heading-sm mb-2">
            Results ({searchResults.meta.totalResults})
          </h3>
          {searchResults.results.length > 0 ? (
            <ul className="space-y-6">
              {searchResults.results.map((item, index) => (
                <li
                  key={index}
                  className="bg-[var(--color-paper)] border border-[var(--color-stone)]/20 rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4"
                >
                  {item.bookJacketUrl && (
                    <div className="flex-shrink-0 w-24 md:w-32">
                      <img
                        src={`${SEARCH_DOWN_CTA_URL}/${item.bookJacketUrl}`}
                        alt={`Cover of ${item.title}`}
                        className="w-full rounded"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="type-heading-xs mb-1">{item.title}</h4>
                    <p className="type-body-sm text-[var(--color-charcoal)] mb-2">{item.expandedAuthor}</p>
                    <p className="type-body-sm text-[var(--color-charcoal)]/70 mb-3">{item.description}</p>

                    {Object.keys(item.extraFields).length > 0 && (
                      <div className="type-body-xs mb-3 overflow-x-auto">
                        <table className="min-w-full border border-[var(--color-stone)]/30">
                          <tbody className="bg-[var(--color-paper)] divide-y divide-[var(--color-stone)]/30">
                            {Object.entries(item.extraFields).map(([key, value]) => (
                              <tr key={key}>
                                <td className="px-3 py-1.5 font-medium capitalize whitespace-nowrap">{key.replace(/([A-Z])/g, ' $1')}</td>
                                <td className="px-3 py-1.5">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 items-center type-body-xs">
                      <span className={`font-medium px-2 py-0.5 rounded ${
                        item.availability === 'Available'
                          ? 'bg-[var(--color-success-light)] text-[var(--color-success-dark,#0e5c2d)]'
                          : 'bg-[var(--color-warning-light)] text-[var(--color-warning-dark,#af640d)]'
                      }`}>
                        {item.availability} ({item.copies} {item.copies === 1 ? 'copy' : 'copies'})
                      </span>
                      {item.googlePreviewUrl && (
                        <a
                          href={item.googlePreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] rounded-sm"
                        >
                          Google Preview
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="type-body-md">No results found for "{currentQuery}".</p>
              <button
                className="btn btn-outline mt-4"
                aria-label={`Request the book "${currentQuery}"`}
                onClick={() => {
                  console.log('Request this book clicked for:', currentQuery);
                }}
              >
                Request this book
              </button>
            </>
          )}

          {searchResults && searchResults.meta.totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="px-4 py-2 bg-[var(--color-paper)] border border-[var(--color-stone)]/30 rounded hover:bg-[var(--color-stone)]/20 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
              >
                &larr; Previous
              </button>
              <span className="type-body-sm text-[var(--color-charcoal)]">
                Page {currentPage} of {searchResults.meta.totalPages} ({searchResults.meta.totalResults} results)
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= searchResults.meta.totalPages || isLoading}
                className="px-4 py-2 bg-[var(--color-paper)] border border-[var(--color-stone)]/30 rounded hover:bg-[var(--color-stone)]/20 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWidget;
