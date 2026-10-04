/// <reference types="node" />
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getValidCombinations, getValidFactions, getValidRaces, generateCharacter } from './randomizer.ts'
import { validCombinations } from '../data/compatibility.ts'
import type { CharacterFilters } from '../types/character.ts'

const alwaysFirst = () => 0

function assertGenerates(filters: CharacterFilters, expected: CharacterFilters): void {
  const character = generateCharacter(filters, alwaysFirst)
  assert.ok(character)
  for (const key of ['faction', 'race', 'class'] as const) {
    if (expected[key] !== undefined) assert.equal(character[key], expected[key])
  }
  assert.ok(validCombinations.some(({ faction, race, class: characterClass }) =>
    faction === character.faction && race === character.race && characterClass === character.class,
  ))
}

describe('compatibility queries', () => {
  it('resolves Horde + Paladin to Undead', () => {
    assert.deepEqual(getValidRaces({ faction: 'Horde', class: 'Paladin' }), ['Undead'])
    assert.deepEqual(getValidRaces({ class: 'Paladin' }), ['Human', 'Dwarf', 'Undead'])
  })

  it('filters to every valid Druid race, including Skyborne variants', () => {
    assert.deepEqual(getValidRaces({ class: 'Druid' }), ['Night Elf', 'High Order Skyborne', 'Tauren', 'Windshaper Skyborne'])
  })

  it('resolves Night Elf to Alliance', () => {
    assert.deepEqual(getValidFactions({ race: 'Night Elf' }), ['Alliance'])
  })

  it('resolves Dwarf + Shaman to a valid combination', () => {
    assert.deepEqual(getValidCombinations({ race: 'Dwarf', class: 'Shaman' }), [
      { faction: 'Alliance', race: 'Dwarf', class: 'Shaman' },
    ])
  })

  it('keeps Skyborne class availability faction-specific', () => {
    assert.deepEqual(getValidCombinations({ faction: 'Alliance', race: 'High Order Skyborne', class: 'Mage' }), [
      { faction: 'Alliance', race: 'High Order Skyborne', class: 'Mage' },
    ])
    assert.deepEqual(getValidCombinations({ faction: 'Horde', race: 'Windshaper Skyborne', class: 'Shaman' }), [
      { faction: 'Horde', race: 'Windshaper Skyborne', class: 'Shaman' },
    ])
    assert.equal(getValidCombinations({ faction: 'Horde', race: 'Windshaper Skyborne', class: 'Mage' }).length, 0)
    assert.equal(getValidCombinations({ faction: 'Alliance', race: 'High Order Skyborne', class: 'Shaman' }).length, 0)
  })
})

describe('character generation', () => {
  it('generates every listed valid race/class example', () => {
    const examples: CharacterFilters[] = [
      { faction: 'Horde', race: 'Undead', class: 'Paladin' },
      { faction: 'Alliance', race: 'Dwarf', class: 'Shaman' },
      { faction: 'Horde', race: 'Orc', class: 'Mage' },
      { faction: 'Alliance', race: 'Human', class: 'Hunter' },
      { faction: 'Alliance', race: 'Gnome', class: 'Priest' },
      { faction: 'Horde', race: 'Troll', class: 'Warlock' },
      { faction: 'Alliance', race: 'High Order Skyborne', class: 'Mage' },
      { faction: 'Horde', race: 'Windshaper Skyborne', class: 'Shaman' },
    ]

    for (const example of examples) assertGenerates(example, example)
  })

  it('returns null for impossible selections', () => {
    const impossible = { faction: 'Alliance', race: 'Dwarf', class: 'Druid' } as const
    assert.equal(generateCharacter(impossible), null)
    assert.deepEqual(getValidRaces({ faction: 'Horde', class: 'Paladin' }), ['Undead'])
  })

  it('randomizes gender independently and honors a fixed gender', () => {
    const randomValues = [0, 0.99]
    const randomGender = generateCharacter(
      { faction: 'Horde', race: 'Undead', class: 'Paladin' },
      () => randomValues.shift() ?? 0,
    )
    assert.equal(randomGender?.gender, 'Female')
    assert.equal(generateCharacter({ faction: 'Horde', race: 'Undead', class: 'Paladin', gender: 'Male' }, alwaysFirst)?.gender, 'Male')
  })

  it('always generates a valid combination when every dimension is random', () => {
    for (let i = 0; i < 500; i++) assertGenerates({}, {})
  })
})
