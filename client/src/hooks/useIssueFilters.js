import { useState, useCallback, useMemo } from 'react'

const DEFAULT_FILTERS = {
  status:   '',
  priority: '',
  assignee: '',
}

export const useIssueFilters = () => {
  const [filters, setFilters]   = useState(DEFAULT_FILTERS)
  const [page, setPage]         = useState(1)
  const [limit]                 = useState(20)

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }, [])

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  )

  const queryParams = useMemo(() => ({
    ...Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v)
    ),
    page,
    limit,
  }), [filters, page, limit])

  return {
    filters,
    page,
    limit,
    setFilter,
    setPage,
    clearFilters,
    activeFilterCount,
    queryParams,
  }
}
