/// <reference types="node" />
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { namesByRace } from '../data/names.ts'
import { GENDERS, RACES } from '../types/character.ts'
import { generateFirstName, generateFullName, generateSurname } from './nameGenerator.ts'

const first = () => 0
const last = () => 0.999999

describe('character naming', () => {
  it('provides separate male, female, and surname pools for every race', () => {
    assert.deepEqual(Object.keys(namesByRace).sort(), [...RACES].sort())
    for (const race of RACES) {
      assert.ok(namesByRace[race].maleFirstNames.length >= 12)
      assert.ok(namesByRace[race].femaleFirstNames.length >= 12)
      assert.ok(namesByRace[race].surnames.length >= 16)
    }
  })

  it('chooses first names from the selected gender and surname from the selected race', () => {
    for (const race of RACES) {
      for (const gender of GENDERS) {
        assert.ok(namesByRace[race][gender === 'Male' ? 'maleFirstNames' : 'femaleFirstNames'].includes(generateFirstName(race, gender, first)))
      }
      assert.equal(generateSurname(race, first), namesByRace[race].surnames[0])
      assert.equal(generateSurname(race, last), namesByRace[race].surnames.at(-1))
    }
  })

  it('keeps both Skyborne profiles independent', () => {
    assert.notEqual(namesByRace['High Order Skyborne'], namesByRace['Windshaper Skyborne'])
    assert.notDeepEqual(namesByRace['High Order Skyborne'].surnames, namesByRace['Windshaper Skyborne'].surnames)
    assert.equal(generateSurname('High Order Skyborne', first), namesByRace['High Order Skyborne'].surnames[0])
    assert.equal(generateSurname('Windshaper Skyborne', first), namesByRace['Windshaper Skyborne'].surnames[0])
  })

  it('returns separate first-name and surname values for a full name', () => {
    assert.deepEqual(generateFullName('Night Elf', 'Female', first), {
      firstName: namesByRace['Night Elf'].femaleFirstNames[0],
      surname: namesByRace['Night Elf'].surnames[0],
    })
  })
})
