// Values are intentionally open until the verified WoW Forever data is provided.
export type Faction = string
export type Race = string
export type Class = string
export type Gender = 'Male' | 'Female'

export interface Character {
  faction: Faction
  race: Race
  class: Class
  gender: Gender
}
