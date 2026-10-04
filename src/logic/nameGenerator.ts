import { classSurnamesByCombination, getFirstNamePool, namesByRace } from '../data/names.ts'
import type { Class, Gender, Race } from '../types/character.ts'

export interface CharacterName {
  firstName: string
  surname: string
}

export interface NameGenerationOptions {
  characterClass?: Class
  classInfluence?: boolean
  random?: () => number
}

function pick<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)]
}

export function generateFirstName(race: Race, gender: Gender, random: () => number = Math.random): string {
  return pick(getFirstNamePool(race, gender), random)
}

export function generateSurname(race: Race, { characterClass, classInfluence = false, random = Math.random }: NameGenerationOptions = {}): string {
  const classPool = characterClass && classInfluence ? classSurnamesByCombination[`${race}|${characterClass}`] : undefined
  return classPool?.length && random() < 0.35
    ? pick(classPool, random)
    : pick(namesByRace[race].surnames, random)
}

export function generateFullName(race: Race, gender: Gender, options: NameGenerationOptions = {}): CharacterName {
  const { random = Math.random } = options
  return { firstName: generateFirstName(race, gender, random), surname: generateSurname(race, { ...options, random }) }
}
