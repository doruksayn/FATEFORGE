import type { CharacterName } from '../logic/nameGenerator.ts'
import { FACTIONS, GENDERS, RACES, CLASSES, type Character } from '../types/character.ts'

export const HISTORY_STORAGE_KEY = 'wow-forever-roulette.history.v1'
export const MAX_HISTORY_ENTRIES = 20

export interface RollHistoryEntry extends Character, CharacterName {
  id: string
  createdAt: string
}

type StorageReader = Pick<Storage, 'getItem'>
type StorageWriter = Pick<Storage, 'setItem' | 'removeItem'>

function getBrowserStorage(): Storage | undefined {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

function isHistoryEntry(value: unknown): value is RollHistoryEntry {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return typeof entry.id === 'string' &&
    typeof entry.createdAt === 'string' && Number.isFinite(Date.parse(entry.createdAt)) &&
    typeof entry.firstName === 'string' && typeof entry.surname === 'string' &&
    FACTIONS.includes(entry.faction as (typeof FACTIONS)[number]) &&
    RACES.includes(entry.race as (typeof RACES)[number]) &&
    CLASSES.includes(entry.class as (typeof CLASSES)[number]) &&
    GENDERS.includes(entry.gender as (typeof GENDERS)[number])
}

export function parseHistory(raw: string | null): RollHistoryEntry[] {
  if (raw === null) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isHistoryEntry).slice(0, MAX_HISTORY_ENTRIES)
  } catch {
    return []
  }
}

export function loadHistory(storage: StorageReader | undefined = getBrowserStorage()): RollHistoryEntry[] {
  try {
    return parseHistory(storage?.getItem(HISTORY_STORAGE_KEY) ?? null)
  } catch {
    return []
  }
}

export function persistHistory(history: readonly RollHistoryEntry[], storage: StorageWriter | undefined = getBrowserStorage()): void {
  try {
    storage?.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES)))
  } catch {
    // Storage can be unavailable or full; rolling remains usable in memory.
  }
}

export function clearPersistedHistory(storage: StorageWriter | undefined = getBrowserStorage()): void {
  try {
    storage?.removeItem(HISTORY_STORAGE_KEY)
  } catch {
    // Clearing the in-memory history still works if storage is unavailable.
  }
}

export function prependHistoryEntry(
  history: readonly RollHistoryEntry[],
  entry: RollHistoryEntry,
): RollHistoryEntry[] {
  return [entry, ...history].slice(0, MAX_HISTORY_ENTRIES)
}

export function updateHistoryName(
  history: readonly RollHistoryEntry[],
  id: string,
  name: CharacterName,
): RollHistoryEntry[] {
  return history.map((entry) => entry.id === id ? { ...entry, ...name } : entry)
}

export function removeHistoryEntry(
  history: readonly RollHistoryEntry[],
  id: string,
): RollHistoryEntry[] {
  return history.filter((entry) => entry.id !== id)
}

export function createHistoryEntry(character: Character, name: CharacterName): RollHistoryEntry {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return { ...character, ...name, id, createdAt: new Date().toISOString() }
}
