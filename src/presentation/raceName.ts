import type { Race } from '../types/character.ts'

export function getRaceDisplayName(race: Race): string {
  return race === 'High Order Skyborne' || race === 'Windshaper Skyborne'
    ? 'Skyborne'
    : race
}
