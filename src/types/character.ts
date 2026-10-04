export const RANDOM = 'Random' as const

export const FACTIONS = ['Alliance', 'Horde'] as const
export type Faction = (typeof FACTIONS)[number]

export const RACES = [
  'Human',
  'Dwarf',
  'Night Elf',
  'Gnome',
  'High Order Skyborne',
  'Orc',
  'Undead',
  'Tauren',
  'Troll',
  'Windshaper Skyborne',
] as const
export type Race = (typeof RACES)[number]

export const CLASSES = [
  'Warrior',
  'Paladin',
  'Hunter',
  'Rogue',
  'Priest',
  'Mage',
  'Warlock',
  'Shaman',
  'Druid',
] as const
export type Class = (typeof CLASSES)[number]

export const GENDERS = ['Male', 'Female'] as const
export type Gender = (typeof GENDERS)[number]

export type RandomOption<T extends string> = T | typeof RANDOM

export interface CharacterSelection {
  faction: RandomOption<Faction>
  race: RandomOption<Race>
  class: RandomOption<Class>
  gender: RandomOption<Gender>
}

export type CharacterFilters = Partial<CharacterSelection>

export interface CharacterCombination {
  faction: Faction
  race: Race
  class: Class
}

export interface Character extends CharacterCombination {
  gender: Gender
}
