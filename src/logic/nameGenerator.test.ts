/// <reference types="node" />
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { classSurnamesByCombination, namesByRace } from '../data/names.ts'
import { validCombinations } from '../data/compatibility.ts'
import { GENDERS, RACES } from '../types/character.ts'
import { generateFirstName, generateFullName, generateSurname } from './nameGenerator.ts'

const first = () => 0
const last = () => 0.999999

describe('character naming', () => {
  it('provides separate male, female, and surname pools for every race', () => {
    assert.deepEqual(Object.keys(namesByRace).sort(), [...RACES].sort())
    for (const race of RACES) {
      assert.ok(namesByRace[race].maleFirstNames.length >= 24)
      assert.ok(namesByRace[race].femaleFirstNames.length >= 24)
      assert.ok(namesByRace[race].surnames.length >= 24)
    }
  })

  it('chooses first names from the selected gender and surname from the selected race', () => {
    for (const race of RACES) {
      for (const gender of GENDERS) {
        assert.ok(namesByRace[race][gender === 'Male' ? 'maleFirstNames' : 'femaleFirstNames'].includes(generateFirstName(race, gender, first)))
      }
      assert.equal(generateSurname(race, { random: first }), namesByRace[race].surnames[0])
      assert.equal(generateSurname(race, { random: last }), namesByRace[race].surnames.at(-1))
    }
  })

  it('keeps both Skyborne profiles independent', () => {
    assert.notEqual(namesByRace['High Order Skyborne'], namesByRace['Windshaper Skyborne'])
    assert.notDeepEqual(namesByRace['High Order Skyborne'].surnames, namesByRace['Windshaper Skyborne'].surnames)
    assert.equal(generateSurname('High Order Skyborne', { random: first }), namesByRace['High Order Skyborne'].surnames[0])
    assert.equal(generateSurname('Windshaper Skyborne', { random: first }), namesByRace['Windshaper Skyborne'].surnames[0])
  })

  it('returns separate first-name and surname values for a full name', () => {
    assert.deepEqual(generateFullName('Night Elf', 'Female', { random: first }), {
      firstName: namesByRace['Night Elf'].femaleFirstNames[0],
      surname: namesByRace['Night Elf'].surnames[0],
    })
  })

  it('provides six class surnames for every valid compatibility combination', () => {
    assert.equal(Object.keys(classSurnamesByCombination).length, validCombinations.length)
    for (const { race, class: characterClass } of validCombinations) {
      assert.equal(classSurnamesByCombination[`${race}|${characterClass}`].length, 6)
      assert.equal(generateSurname(race, { characterClass, classInfluence: true, random: first }), classSurnamesByCombination[`${race}|${characterClass}`][0])
    }
  })

  it('uses the class pool on 35% surname rolls and keeps race-only generation unchanged', () => {
    const classPool = classSurnamesByCombination['Night Elf|Druid']
    assert.equal(generateSurname('Night Elf', { characterClass: 'Druid', classInfluence: true, random: first }), classPool[0])
    assert.equal(generateSurname('Night Elf', { characterClass: 'Druid', classInfluence: true, random: last }), namesByRace['Night Elf'].surnames.at(-1))
    const at34Percent = [0.34, 0]
    const at35Percent = [0.35, 0]
    assert.ok(generateSurname('Night Elf', { characterClass: 'Druid', classInfluence: true, random: () => at34Percent.shift() ?? 0 }).startsWith('Boughwhisper '))
    assert.equal(generateSurname('Night Elf', { characterClass: 'Druid', classInfluence: true, random: () => at35Percent.shift() ?? 0 }), namesByRace['Night Elf'].surnames[0])
    assert.equal(generateSurname('Human', { characterClass: 'Druid', classInfluence: true, random: first }), namesByRace.Human.surnames[0])
  })
})
