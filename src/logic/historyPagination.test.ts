/// <reference types="node" />
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { clampHistoryPage, getHistoryPage, getHistoryPageCount } from './historyPagination.ts'

describe('history pagination', () => {
  it('calculates pages for the supported history sizes', () => {
    assert.equal(getHistoryPageCount(0), 1)
    assert.equal(getHistoryPageCount(4), 1)
    assert.equal(getHistoryPageCount(5), 2)
    assert.equal(getHistoryPageCount(8), 2)
    assert.equal(getHistoryPageCount(9), 3)
    assert.equal(getHistoryPageCount(20), 5)
  })

  it('shows four newest-first entries per page', () => {
    const entries = Array.from({ length: 20 }, (_, index) => index + 1)
    assert.deepEqual(getHistoryPage(entries, 1), [1, 2, 3, 4])
    assert.deepEqual(getHistoryPage(entries, 2), [5, 6, 7, 8])
    assert.deepEqual(getHistoryPage(entries, 5), [17, 18, 19, 20])
  })

  it('clamps page state when the entry count shrinks or is empty', () => {
    assert.equal(clampHistoryPage(5, 9), 3)
    assert.equal(clampHistoryPage(4, 0), 1)
    assert.equal(clampHistoryPage(0, 8), 1)
  })
})
