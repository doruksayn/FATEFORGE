export const HISTORY_PAGE_SIZE = 4

export function getHistoryPageCount(entryCount: number): number {
  return Math.max(1, Math.ceil(entryCount / HISTORY_PAGE_SIZE))
}

export function clampHistoryPage(page: number, entryCount: number): number {
  return Math.min(Math.max(1, page), getHistoryPageCount(entryCount))
}

export function getHistoryPage<T>(entries: readonly T[], page: number): T[] {
  const safePage = clampHistoryPage(page, entries.length)
  return entries.slice((safePage - 1) * HISTORY_PAGE_SIZE, safePage * HISTORY_PAGE_SIZE)
}
