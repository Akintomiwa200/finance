"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

interface UsePaginationOptions<T> {
  data: T[];
  pageSize?: number;
  initialPage?: number;
  serverSide?: boolean;
  total?: number;
  onPageChange?: (page: number) => void;
}

export function usePagination<T>({
  data,
  pageSize = 10,
  initialPage = 1,
  serverSide = false,
  total: serverTotal,
  onPageChange,
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalItems = serverSide ? (serverTotal ?? data.length) : data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedData = useMemo(() => {
    if (serverSide) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize, serverSide]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clamped);
      onPageChange?.(clamped);
    },
    [totalPages, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

  const setPageSize = useCallback(
    (newSize: number) => {
      const newTotalPages = Math.max(1, Math.ceil(totalItems / newSize));
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    },
    [totalItems, currentPage]
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startItem,
    endItem,
    pageNumbers,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    setCurrentPage,
  } as const;
}
