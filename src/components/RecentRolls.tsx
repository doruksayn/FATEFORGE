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
  title?: string
  onSelectEntry?: (entry: RollHistoryEntry) => void
  selectedEntryId?: string | null
  hint?: string
}

export function RecentRolls({ entries, page, onPageChange, onClear, onRemove, title = 'Recent Rolls', onSelectEntry, selectedEntryId, hint }: RecentRollsProps) {
  const totalPages = getHistoryPageCount(entries.length)
  const currentPage = clampHistoryPage(page, entries.length)
  const visibleEntries = getHistoryPage(entries, currentPage)

  function confirmClear() {
    if (entries.length > 0 && window.confirm(`Clear all ${title.toLowerCase()}? This cannot be undone.`)) onClear()
  }

  return (
    <section className={`history-section${entries.length === 0 ? ' history-section--empty' : ''}`} aria-labelledby="history-heading">
      <div className={`history-heading${hint ? ' history-heading--hinted' : ''}`}>
        <h2 id="history-heading">{title}</h2>
        <button className="clear-history-button" type="button" onClick={confirmClear} disabled={entries.length === 0}>
          Clear History
        </button>
      </div>
      {hint && <p className="history-heading-hint">{hint}</p>}
      {entries.length === 0 ? (
        <p className="history-empty">No paths have been written yet.</p>
      ) : (
        <>
          <ol className="history-grid" aria-label={title}>
          {visibleEntries.map((entry) => (
            <li className={`history-entry history-entry--${entry.faction.toLowerCase()}${onSelectEntry ? ' history-entry--selectable' : ''}${selectedEntryId === entry.id ? ' history-entry--selected' : ''}`} key={entry.id}>
              <button
                className="history-entry-remove"
                type="button"
                onClick={() => onRemove(entry.id)}
                aria-label={`Delete ${entry.firstName} ${entry.surname} from history`}
                title="Delete this roll"
              >
                <span className="history-remove-icon" aria-hidden="true" />
              </button>
              {onSelectEntry && <button className="history-entry-open" type="button" onClick={() => onSelectEntry(entry)} aria-label={`Show ${entry.firstName} ${entry.surname}, ${entry.race} ${entry.class} ${entry.gender}`} aria-pressed={selectedEntryId === entry.id} />}
              <ClassIcon characterClass={entry.class} />
              <div className="history-entry-copy">
                <p className="history-name">{entry.firstName} {entry.surname}</p>
                <p className="history-details">{getRaceDisplayName(entry.race)} <span aria-hidden="true">·</span> {entry.class} <span aria-hidden="true">·</span> {entry.gender}</p>
                <p className="history-faction">{entry.faction}</p>
              </div>
            </li>
          ))}
          </ol>
          <nav className="history-pagination" aria-label={`${title} pages`}>
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
