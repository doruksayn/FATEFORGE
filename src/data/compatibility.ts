import type { Class, Faction, Race, CharacterCombination } from '../types/character'

export interface RaceCompatibility {
  faction: Faction
  race: Race
  classes: readonly Class[]
}

// Skyborne variants stay faction-specific so their class lists cannot be mixed.
export const compatibilityData = [
  {
    faction: 'Alliance',
    race: 'Human',
    classes: ['Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Mage', 'Warlock'],
  },
  {
    faction: 'Alliance',
    race: 'Dwarf',
    classes: ['Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Shaman'],
  },
  {
    faction: 'Alliance',
    race: 'Night Elf',
    classes: ['Warrior', 'Hunter', 'Rogue', 'Priest', 'Druid'],
  },
  {
    faction: 'Alliance',
    race: 'Gnome',
    classes: ['Warrior', 'Rogue', 'Priest', 'Mage', 'Warlock'],
  },
  {
    faction: 'Alliance',
    race: 'High Order Skyborne',
    classes: ['Warrior', 'Hunter', 'Rogue', 'Mage', 'Druid'],
  },
  {
    faction: 'Horde',
    race: 'Orc',
    classes: ['Warrior', 'Hunter', 'Rogue', 'Shaman', 'Mage', 'Warlock'],
  },
  {
    faction: 'Horde',
    race: 'Undead',
    classes: ['Warrior', 'Paladin', 'Rogue', 'Priest', 'Mage', 'Warlock'],
  },
  {
    faction: 'Horde',
    race: 'Tauren',
    classes: ['Warrior', 'Hunter', 'Shaman', 'Druid'],
  },
  {
    faction: 'Horde',
    race: 'Troll',
    classes: ['Warrior', 'Hunter', 'Rogue', 'Priest', 'Shaman', 'Mage', 'Warlock'],
  },
  {
    faction: 'Horde',
    race: 'Windshaper Skyborne',
    classes: ['Warrior', 'Hunter', 'Rogue', 'Shaman', 'Druid'],
  },
] as const satisfies readonly RaceCompatibility[]

export const validCombinations: readonly CharacterCombination[] =
  compatibilityData.flatMap(({ faction, race, classes }) =>
    classes.map((characterClass) => ({ faction, race, class: characterClass })),
  )
