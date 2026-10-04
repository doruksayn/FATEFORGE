/// <reference types="node" />
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  HISTORY_STORAGE_KEY,
  NAME_HISTORY_STORAGE_KEY,
  MAX_HISTORY_ENTRIES,
  clearPersistedHistory,
  loadHistory,
  parseHistory,
  persistHistory,
  prependHistoryEntry,
  removeHistoryEntry,
  updateHistoryName,
  type RollHistoryEntry,
} from './history.ts'

function entry(index: number): RollHistoryEntry {
  return {
    id: `roll-${index}`,
    faction: index % 2 === 0 ? 'Alliance' : 'Horde',
    race: index % 2 === 0 ? 'Human' : 'Orc',
    class: 'Warrior',
    gender: 'Female',
    firstName: `Name${index}`,
    surname: `Surname${index}`,
    createdAt: new Date(index * 1000).toISOString(),
  }
}

function fakeStorage(initial?: string) {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(HISTORY_STORAGE_KEY, initial)
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value) },
    removeItem: (key: string) => { data.delete(key) },
  }
}

describe('roll history', () => {
  it('prepends completed rolls newest first and caps history at 20', () => {
    let history: RollHistoryEntry[] = []
    for (let index = 0; index <= MAX_HISTORY_ENTRIES; index++) {
      history = prependHistoryEntry(history, entry(index))
    }
    assert.equal(history.length, 20)
    assert.equal(history[0].id, 'roll-20')
    assert.equal(history.at(-1)?.id, 'roll-1')
  })

  it('updates the latest roll name without adding a history entry', () => {
    const history = [entry(2), entry(1)]
    const updated = updateHistoryName(history, 'roll-2', { firstName: 'Changed', surname: 'Again' })
    assert.equal(updated.length, history.length)
    assert.equal(updated[0].firstName, 'Changed')
    assert.equal(updated[0].surname, 'Again')
    assert.equal(updated[1].firstName, 'Name1')
  })

  it('removes only the requested history entry', () => {
    const history = [entry(3), entry(2), entry(1)]
    assert.deepEqual(removeHistoryEntry(history, 'roll-2').map(({ id }) => id), ['roll-3', 'roll-1'])
    assert.equal(removeHistoryEntry(history, 'missing').length, history.length)
  })

  it('serializes and restores validated entries from local storage', () => {
    const storage = fakeStorage()
    persistHistory([entry(4)], storage)
    assert.deepEqual(loadHistory(storage), [entry(4)])
  })

  it('returns empty history for invalid JSON or unexpected entry structures', () => {
    assert.deepEqual(parseHistory('{broken'), [])
    assert.deepEqual(parseHistory(JSON.stringify({ history: [entry(1)] })), [])
    assert.deepEqual(parseHistory(JSON.stringify([{ ...entry(1), faction: 'Neutral' }])), [])
    assert.deepEqual(loadHistory({ getItem: () => { throw new Error('blocked') } }), [])
  })

  it('clears persisted entries', () => {
    const storage = fakeStorage(JSON.stringify([entry(0)]))
    clearPersistedHistory(storage)
    assert.equal(storage.getItem(HISTORY_STORAGE_KEY), null)
    assert.deepEqual(loadHistory(storage), [])
  })

  it('stores Name Generator history separately from Randomizer history', () => {
    const storage = fakeStorage()
    const rolls = [entry(1)]
    const names = [entry(2)]
    persistHistory(rolls, storage)
    persistHistory(names, storage, NAME_HISTORY_STORAGE_KEY)

    assert.deepEqual(loadHistory(storage), rolls)
    assert.deepEqual(loadHistory(storage, NAME_HISTORY_STORAGE_KEY), names)

    clearPersistedHistory(storage, NAME_HISTORY_STORAGE_KEY)
    assert.deepEqual(loadHistory(storage), rolls)
    assert.deepEqual(loadHistory(storage, NAME_HISTORY_STORAGE_KEY), [])
  })
})
