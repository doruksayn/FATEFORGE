import { useState } from 'react'
import type { Class } from '../types/character.ts'
import { ClassEmblem } from './ClassEmblem.tsx'

interface ClassIconProps {
  characterClass: Class
}

const iconFiles: Record<Class, string> = {
  Warrior: 'warrior.png',
  Paladin: 'paladin.png',
  Hunter: 'hunter.png',
  Rogue: 'rogue.png',
  Priest: 'priest.png',
  Mage: 'mage.png',
  Warlock: 'warlock.png',
  Shaman: 'shaman.png',
  Druid: 'druid.png',
}

export function ClassIcon({ characterClass }: ClassIconProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const source = `${import.meta.env.BASE_URL}class-icons/${iconFiles[characterClass]}`

  if (failedSource === source) {
    return (
      <span className="class-icon class-icon--fallback" aria-hidden="true">
        <ClassEmblem characterClass={characterClass} />
      </span>
    )
  }

  return (
    <img
      key={source}
      className="class-icon class-icon--image"
      src={source}
      alt=""
      aria-hidden="true"
      onError={() => setFailedSource(source)}
    />
  )
}
