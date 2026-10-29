import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';

// React hook for paged search within the Admin Console.

// Debouncing: We use setTimeout inside an effect to delay execution of the fetch
// (by 300ms by default) This ensures rapid keystrokes dont flood the backend api
// with requests for every single character typed.

// AbortController: This cancels in-flight HTTP requests when a new search term
// (or page change) occurs. This prevents a race with earlier keystrokes. We also
// abort if the component unmounts.

// This hook sets isLoading and error for the calling component to use.

const usePagedSearch = (fetchDataFn, routeprefix, rowsPerPage = 10) =>
{
  const { page } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currPage = page ? parseInt(page, 10) : 1;
  const searchTerm = searchParams.get('bs') || '';

  const [totResults, setTotResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRef = useRef(fetchDataFn); fetchRef.current = fetchDataFn;
  const totPages = Math.ceil(totResults / rowsPerPage);

  // Handle search changes: reset to page 1 and update URL query params
  const handleSearchChange = useCallback((newSearchTerm) => {
    if (currPage !== 1) {
      // Construct a url like https://siteurl/admin/useraccounts/1?bs=abc
      navigate(`${routeprefix}/1${newSearchTerm ? `?bs=${encodeURIComponent(newSearchTerm)}` : ''}`);
    } else {
      setSearchParams(newSearchTerm ? { bs: newSearchTerm } : {});
    }
  }, [currPage, navigate, setSearchParams]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchCurrentPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchRef.current(currPage, searchTerm, rowsPerPage, controller.signal);
        if (isMounted) {
          console.log('Data fetched:', response.data);
          setTotResults(response.totalRows || 0);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Request failed after retries:', error);
          setError(err);
        }
      } finally {
        if (isMounted) {
          console.log('Request (and retries) completed. This runs regardless of success or failure.');
          setIsLoading(false);
        }
      }
    };

    // Debounce search input changes by 300ms
    const timeoutId = setTimeout(() => {
      fetchCurrentPage();
    }, 300);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [currPage, searchTerm, rowsPerPage]);

  return {
    totResults,
    totPages,
    currPage,
    searchTerm,
    isLoading,
    error,
    handleSearchChange,
  };
}
export default usePagedSearch;
