import { getFirstNamePool, namesByRace } from '../data/names.ts'
import type { Gender, Race } from '../types/character.ts'

export interface CharacterName {
  firstName: string
  surname: string
}

function pick<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)]
}

export function generateFirstName(race: Race, gender: Gender, random: () => number = Math.random): string {
  return pick(getFirstNamePool(race, gender), random)
}

export function generateSurname(race: Race, random: () => number = Math.random): string {
  return pick(namesByRace[race].surnames, random)
}

export function generateFullName(race: Race, gender: Gender, random: () => number = Math.random): CharacterName {
  return { firstName: generateFirstName(race, gender, random), surname: generateSurname(race, random) }
}
