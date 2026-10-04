/// <reference types="node" />
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getToolFromHash } from './toolRoute.ts'

describe('tool hash navigation', () => {
  it('opens the name generator for its hash', () => assert.equal(getToolFromHash('#/names'), 'names'))
  it('defaults empty and unknown hashes to the character randomizer', () => {
    assert.equal(getToolFromHash(''), 'character')
    assert.equal(getToolFromHash('#/other'), 'character')
  })
})
