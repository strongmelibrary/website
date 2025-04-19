import React, { useState, useEffect, useCallback } from 'react';
import {
  BOOKWORM_API_URL,
  SEARCH_DOWN_CTA_URL,
  BOOKWORM_USERNAME,
  BOOKWORM_PASSWORD,
} from '../../config';

interface SearchWidgetProps {
  showResultsInline?: boolean; // If true, show results directly; otherwise, navigate to search page
}

// Define placeholder types for API response (replace with actual types later)
interface HealthStatus {
  status: string;
}

// Updated interface based on BookInfo schema
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

// Add PageMeta interface based on schema
interface PageMeta {
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
}

// Update SearchResults to include full meta
interface SearchResults {
  meta: PageMeta;
  results: SearchResultItem[];
}


const SearchWidget: React.FC<SearchWidgetProps> = ({ showResultsInline = false }) => {
  const [isServiceHealthy, setIsServiceHealthy] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuery, setCurrentQuery] = useState(''); // Store the query that fetched the current results
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const healthCheckUrl = `${BOOKWORM_API_URL}/health`;
  const searchUrl = `${BOOKWORM_API_URL}/api/scrape`;
  const ctaUrl = SEARCH_DOWN_CTA_URL; // Get CTA URL from config

  // Check service health on component mount
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

    // Update URL only on client-side search page interactions
    if (typeof window !== 'undefined' && showResultsInline) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      url.searchParams.set('page', page.toString());
      window.history.pushState({ path: url.toString() }, '', url.toString());
    }

    setIsLoading(true);
    setCurrentQuery(query); // Store the active query
    setCurrentPage(page); // Store the active page
    setError(null);
    setSearchResults(null);

    // Use credentials from config
    const username = BOOKWORM_USERNAME;
    const password = BOOKWORM_PASSWORD; // Optional

    const queryParams = new URLSearchParams({
        search: query,
        username: username,
        page: page.toString(), // Add page parameter
    });
    if (password) {
        queryParams.append('password', password);
    }

    try {
        const response = await fetch(`${searchUrl}?${queryParams.toString()}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: SearchResults = await response.json();
        setSearchResults(data);
    } catch (err: any) {
        console.error('Search failed:', err);
        setError(err.message || 'Failed to fetch search results.');
    } finally {
        setIsLoading(false);
    }
  }, [searchUrl, showResultsInline]); // Added showResultsInline dependency for URL update logic

  // Effect to read query and page params on search page load
  useEffect(() => {
    // Only run on client and on the search page instance
    if (typeof window !== 'undefined' && showResultsInline) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryFromUrl = urlParams.get('q');
      const pageFromUrl = parseInt(urlParams.get('page') || '1', 10);

      if (queryFromUrl) {
        const decodedQuery = decodeURIComponent(queryFromUrl);
        setSearchTerm(decodedQuery);
        // Automatically perform search if query exists in URL
        performSearch(decodedQuery, isNaN(pageFromUrl) ? 1 : pageFromUrl);
      }
    }
    // Run only once on mount for this purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResultsInline]); // performSearch removed to prevent loop, initial load only


  const handleFormSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    // Redirect from home page or trigger search on search page
    if (!showResultsInline) {
      // Always redirect to page 1 on new search from home
      // Redirect to /catalog page with query params
      window.location.href = `/catalog?q=${encodeURIComponent(searchTerm)}&page=1`;
    } else {
      // We are on the catalog page, perform the search for page 1
      performSearch(searchTerm, 1);
    }
  }, [searchTerm, showResultsInline, performSearch]);

  // Handler for pagination clicks
  const handlePageChange = (newPage: number) => {
    if (currentQuery && newPage > 0 && newPage <= (searchResults?.meta.totalPages || 0)) {
      performSearch(currentQuery, newPage);
      // Scroll to top of results might be nice here
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render loading state for health check
  if (isServiceHealthy === null) {
    return <div>Loading search...</div>;
  }

  // Render CTA if service is unhealthy
  if (!isServiceHealthy) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-700 mb-3">The library search service is currently unavailable.</p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Visit Community Reads
        </a>
      </div>
    );
  }

  // Render search form if service is healthy
  return (
    <div className="search-widget my-4">
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search the library catalog..."
          aria-label="Search library catalog"
          className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">Error: {error}</p>}

      {/* Display results only if showResultsInline is true */}
      {showResultsInline && searchResults && (
        <div className="search-results mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Results ({searchResults.meta.totalResults})
          </h3>
          {searchResults.results.length > 0 ? (
            <ul className="space-y-6">
              {searchResults.results.map((item, index) => (
                // Card-like styling: background, padding, rounded corners, shadow
                <li key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
                  {item.bookJacketUrl && (
                    // Removed fixed height, allowing natural aspect ratio
                    <div className="flex-shrink-0 w-24 md:w-32">
                      <img
                        // Prepend SEARCH_DOWN_CTA_URL to image src
                        src={`${SEARCH_DOWN_CTA_URL}/${item.bookJacketUrl}`}
                        alt={`Jacket for ${item.title}`}
                        // Removed h-full and object-cover
                        className="w-full rounded"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                    <p className="text-md text-gray-700 dark:text-gray-300 mb-2">{item.expandedAuthor}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>

                    {/* Render extraFields as a table */}
                    {Object.keys(item.extraFields).length > 0 && (
                      <div className="text-sm mb-3 overflow-x-auto">
                        <table className="min-w-full border border-gray-200 dark:border-gray-700">
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
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

                    <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-sm">
                      <span className={`font-medium px-2 py-0.5 rounded ${item.availability === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {item.availability} ({item.copies} {item.copies === 1 ? 'copy' : 'copies'})
                      </span>
                      {item.googlePreviewUrl && (
                        <a
                          href={item.googlePreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
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
            <p>No results found for "{currentQuery}".</p> // Use currentQuery here
          )}

          {/* Pagination Controls */}
          {searchResults && searchResults.meta.totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {searchResults.meta.totalPages} ({searchResults.meta.totalResults} results)
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= searchResults.meta.totalPages || isLoading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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