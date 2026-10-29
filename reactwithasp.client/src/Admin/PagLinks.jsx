import Pagination from 'react-bootstrap/Pagination';
import { useNavigate, useLocation } from 'react-router';

const PagLinks = ({ length = 1, totPages = 1, currPage = 1, myRoute = '/', maxVisiblePages = 5 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (totPages <= 1) {
    return null;
  }
  
  // Helper to generate the exact target URL string
  const createPageUrl = (pageNumber) => {
    const searchParams = new URLSearchParams(location.search);
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return `${myRoute}/${pageNumber}${queryString}`;
  };

  const handlePageChange = (pageNumber) => {
    // Preserve existing query parameters (like search terms ?bs=...) when changing pages
    const searchParams = new URLSearchParams(location.search);
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    navigate(`${myRoute}/${pageNumber}${queryString}`);
  };
  
  //   0  1  2  3  4  5  6  7  8  9     10 11 12 13 14 15   zero based page index
  //   1  2  3  4  5  6  7  8  9  10    11 12 13 14 15 16   page number
  //   0  0  0  0  0  0  0  0  0  0     1  1  1  1  1  1    window index (zero based)
  //   1  1  1  1  1  1  1  1  1  1     2  2  2  2  2  2    window index
  //   ^

  // Generate pagination items with boundary check for large page counts
  const renderPaginationItems = () => {
    let items = [];
    
    let startPage = Math.max(1, currPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currPage}
          href={createPageUrl(number)}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  // Window leaping size now matches maxVisiblePages dynamically
  const windowSize = maxVisiblePages;
  const currentWindow = Math.floor((currPage - 1) / windowSize);
  const prevWindowPage = Math.max(1, (currentWindow - 1) * windowSize + 1);
  const nextWindowPage = Math.min(totPages, (currentWindow + 1) * windowSize + 1);
  const showJumpPrev = currPage > windowSize;
  const showJumpNext = currentWindow * windowSize + windowSize < totPages;

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      <div className="d-block d-sm-none text-muted small" style={{ marginRight: 8, fontSize: 11 }}>
        Total Records: <strong>{length}</strong>
      </div>
      <div className="d-none d-sm-block text-muted small" style={{ marginRight: 8, fontSize: 13 }}>
        Total Records: <strong>{length}</strong>
      </div>
      <Pagination className="mb-0">

        {/* Window Leap Backward */}
        {showJumpPrev && (
          <Pagination.Item href={createPageUrl(prevWindowPage)} onClick={() => handlePageChange(prevWindowPage)} title={`Previous Window (${windowSize} pages)`}>
            <i className="bi bi-chevron-left"></i>
          </Pagination.Item>
        )}

        {renderPaginationItems()}

        {/* Window Leap Forward */}
        {showJumpNext && (
          <Pagination.Item href={createPageUrl(nextWindowPage)} onClick={() => handlePageChange(nextWindowPage)} title={`Next Window (${windowSize} pages)`}>
            <i className="bi bi-chevron-right"></i>
          </Pagination.Item>
        )}
      </Pagination>
    </div>
  );
};

export default PagLinks;
