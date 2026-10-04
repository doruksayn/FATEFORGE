import { validCombinations } from '../data/compatibility.ts'
import {
  GENDERS,
  RANDOM,
  type Character,
  type CharacterCombination,
  type CharacterFilters,
  type Faction,
  type Gender,
  type Race,
} from '../types/character.ts'

type RandomSource = () => number

function matchesFilters(
  combination: CharacterCombination,
  filters: CharacterFilters,
): boolean {
  return (
    (!filters.faction || filters.faction === RANDOM || filters.faction === combination.faction) &&
    (!filters.race || filters.race === RANDOM || filters.race === combination.race) &&
    (!filters.class || filters.class === RANDOM || filters.class === combination.class)
  )
}

export function getValidCombinations(
  filters: CharacterFilters = {},
): readonly CharacterCombination[] {
  // Gender is independent and is applied only when a full character is generated.
  return validCombinations.filter((combination) => matchesFilters(combination, filters))
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)]
}

export function getValidFactions(filters: CharacterFilters = {}): Faction[] {
  return unique(
    getValidCombinations({ ...filters, faction: RANDOM }).map(({ faction }) => faction),
  )
}

export function getValidRaces(filters: CharacterFilters = {}): Race[] {
  return unique(getValidCombinations({ ...filters, race: RANDOM }).map(({ race }) => race))
}

export function getValidClasses(filters: CharacterFilters = {}): CharacterCombination['class'][] {
  return unique(
    getValidCombinations({ ...filters, class: RANDOM }).map(({ class: characterClass }) => characterClass),
  )
}

export function getValidGenders(filters: CharacterFilters = {}): Gender[] {
  return getValidCombinations(filters).length ? [...GENDERS] : []
}

function pick<T>(values: readonly T[], random: RandomSource): T {
  return values[Math.floor(random() * values.length)]
}

/** Returns null when the fixed selections have no compatible combination. */
export function generateCharacter(
  filters: CharacterFilters = {},
  random: RandomSource = Math.random,
): Character | null {
  const combinations = getValidCombinations(filters)
  if (combinations.length === 0) return null

  const combination = pick(combinations, random)
  const gender = filters.gender && filters.gender !== RANDOM
    ? filters.gender
    : pick(GENDERS, random)

  return { ...combination, gender }
}
