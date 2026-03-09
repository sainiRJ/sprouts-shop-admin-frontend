import { useState, useMemo } from "react";

export function usePagination(items, itemsPerPage = 5) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  return { page, totalPages, paginatedItems, goTo, next, prev, setPage };
}
