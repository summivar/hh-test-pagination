'use client';

import { Fragment, useEffect, useState } from 'react';

export type TPaginationProps = {
  totalItems: number;
  pageSize: number;
  pageNeighbours: number;
  isLoading: boolean;
  onPageChanged: (data: TPaginationData) => void;
};

export type TPaginationData = {
  pageNumber: number;
  pageSize: number;
};

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

export const Pagination = ({
  totalItems,
  pageSize,
  pageNeighbours,
  isLoading,
  onPageChanged,
}: TPaginationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages: number = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    gotoPage(1);
  }, []);

  const gotoPage = (page: number) => {
    const newCurrentPage = Math.max(0, Math.min(page, totalPages));
    setCurrentPage(newCurrentPage);
    onPageChanged({
      pageNumber: newCurrentPage,
      pageSize,
    });
  };

  const handleClick = (page: number) => {
    gotoPage(page);
  };

  const handleMoveLeft = () => {
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = () => {
    gotoPage(currentPage - pageNeighbours * 2 + 1);
  };

  const range = (from: number, to: number, step = 1) => {
    let i = from;
    const range = [];
    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

  const fetchPageNumber = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages: (number | string)[] = [];
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

      let spillOffset = totalNumbers - (endPage - startPage + 1);
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...range(startPage, endPage)];
          break;
        }

        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...range(startPage, endPage), ...extraPages, RIGHT_PAGE];
          break;
        }

        default: {
          pages = [LEFT_PAGE, ...range(startPage, endPage), RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  if (!totalItems || totalPages === 1) return null;

  const pages = fetchPageNumber();

  return (
    <Fragment>
      <nav>
        <ul className="pagination">
          {pages.map((page, index) => {
            if (page === LEFT_PAGE)
              return (
                <li key={index} className="page-item">
                  <button
                    className="page-link"
                    aria-label="Previous"
                    onClick={handleMoveLeft}
                    disabled={isLoading}
                  >
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </button>
                </li>
              );
            if (page === RIGHT_PAGE)
              return (
                <li key={index} className="page-item">
                  <button
                    className="page-link"
                    aria-label="Next"
                    onClick={handleMoveRight}
                    disabled={isLoading}
                  >
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </button>
                </li>
              );
            return (
              <li
                key={index}
                className={`page-item ${currentPage === page ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handleClick(Number(page))}
                  disabled={isLoading}
                >
                  {page}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </Fragment>
  );
};
