import { ClassIcon } from './ClassIcon.tsx'
import type { RollHistoryEntry } from '../storage/history.ts'
import { clampHistoryPage, getHistoryPage, getHistoryPageCount } from '../logic/historyPagination.ts'
import { getRaceDisplayName } from '../presentation/raceName.ts'

interface RecentRollsProps {
  entries: readonly RollHistoryEntry[]
  page: number
  onPageChange: (page: number) => void
  onClear: () => void
  onRemove: (id: string) => void
}

export function RecentRolls({ entries, page, onPageChange, onClear, onRemove }: RecentRollsProps) {
  const totalPages = getHistoryPageCount(entries.length)
  const currentPage = clampHistoryPage(page, entries.length)
  const visibleEntries = getHistoryPage(entries, currentPage)

  function confirmClear() {
    if (entries.length > 0 && window.confirm('Clear all recent rolls? This cannot be undone.')) onClear()
  }

  return (
    <section className={`history-section${entries.length === 0 ? ' history-section--empty' : ''}`} aria-labelledby="history-heading">
      <div className="history-heading">
        <div>
          <h2 id="history-heading">Recent Rolls</h2>
        </div>
        <button className="clear-history-button" type="button" onClick={confirmClear} disabled={entries.length === 0}>
          Clear History
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="history-empty">No paths have been written yet.</p>
      ) : (
        <>
          <ol className="history-grid" aria-label="Recent character rolls">
          {visibleEntries.map((entry) => (
            <li className={`history-entry history-entry--${entry.faction.toLowerCase()}`} key={entry.id}>
              <button
                className="history-entry-remove"
                type="button"
                onClick={() => onRemove(entry.id)}
                aria-label={`Delete ${entry.firstName} ${entry.surname} from history`}
                title="Delete this roll"
              >
                <span className="history-remove-icon" aria-hidden="true" />
              </button>
              <ClassIcon characterClass={entry.class} />
              <div className="history-entry-copy">
                <p className="history-name">{entry.firstName} {entry.surname}</p>
                <p className="history-details">{getRaceDisplayName(entry.race)} <span aria-hidden="true">·</span> {entry.class} <span aria-hidden="true">·</span> {entry.gender}</p>
                <p className="history-faction">{entry.faction}</p>
              </div>
            </li>
          ))}
          </ol>
          <nav className="history-pagination" aria-label="Recent rolls pages">
            <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
              <span aria-hidden="true">←</span> Previous
            </button>
            <span aria-live="polite">{currentPage} / {totalPages}</span>
            <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
              Next <span aria-hidden="true">→</span>
            </button>
          </nav>
        </>
      )}
    </section>
  )
}
