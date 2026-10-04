import type { ReactNode } from 'react'
import type { Class } from '../types/character.ts'

interface ClassEmblemProps {
  characterClass: Class
}

function classSymbol(characterClass: Class): ReactNode {
  switch (characterClass) {
    case 'Warrior':
      return (
        <>
          <path d="m11 9 27 28m-4 3 6-6m-21-8-8 8m19-26L10 38m-3-4 7 7m7-23-8-8" />
          <path d="m8 8 7 2-5 5-2-7Zm32 32-7-2 5-5 2 7Z" />
        </>
      )
    case 'Paladin':
      return (
        <>
          <path d="m24 6 14 6v11c0 9-5.5 15-14 19-8.5-4-14-10-14-19V12l14-6Z" />
          <path d="M24 14v18m-9-9h18m-15-6 12 12m0-12L18 29" />
          <circle cx="24" cy="23" r="3.2" />
        </>
      )
    case 'Hunter':
      return (
        <>
          <path d="M13 7c19 4 19 30 0 34m0-34c8 8 8 26 0 34m1-17h26" />
          <path d="m34 19 6 5-6 5m-7-5 4-3m-4 3 4 3" />
        </>
      )
    case 'Rogue':
      return (
        <>
          <path d="m11 8 25 31m-4 1 8-7M37 8 12 39m4 1-8-7" />
          <path d="m8 8 7 2-5 5-2-7Zm32 0-7 2 5 5 2-7ZM8 40l7-2-5-5-2 7Zm32 0-7-2 5-5 2 7Z" />
          <path d="m20 19 8 10m-8 0 8-10" />
        </>
      )
    case 'Priest':
      return (
        <>
          <path d="M24 5v12m0 14v12M5 24h12m14 0h12M10.5 10.5l8.5 8.5m10 10 8.5 8.5m0-27-8.5 8.5m-10 10-8.5 8.5" />
          <path d="m24 17 3.5 5.5L33 24l-5.5 3.5L24 33l-3.5-5.5L15 24l5.5-1.5L24 17Z" />
          <circle cx="24" cy="24" r="2" />
        </>
      )
    case 'Mage':
      return (
        <>
          <path d="m24 5 12 15-12 23-12-23L24 5Z" />
          <path d="m24 5-3 16 3 22 3-22-3-16Zm-12 15 12 4 12-4m-18 9 6-5 6 5" />
          <path d="M7 15h3m28 18h3M34 8v3m-20 24v3" />
        </>
      )
    case 'Warlock':
      return (
        <>
          <path d="M24 5c2 8 12 10 12 21 0 8-5 14-12 17-7-3-12-9-12-17 0-5 3-9 7-13 0 6 2 8 5 9-2-7 0-12 0-17Z" />
          <path d="M14 26c5-5 15-5 20 0-5 6-15 6-20 0Z" />
          <circle cx="24" cy="26" r="2.4" />
        </>
      )
    case 'Shaman':
      return (
        <>
          <path d="M28 5 14 26h10l-4 17 15-23H25l3-15Z" />
          <path d="M8 19c-3 4-3 8 0 12m32-12c3 4 3 8 0 12M11 35l-3 4m29-4 3 4" />
          <path d="m18 11 3 2m9 22 3 2" />
        </>
      )
    case 'Druid':
      return (
        <>
          <path d="M37 8C20 8 10 15 10 27c0 7 5 12 12 12 12 0 19-10 15-31Z" />
          <path d="M9 40c5-11 13-18 24-24M20 30l-1-8m6 2 8-1m-14 14-7-1" />
          <path d="M17 8a17 17 0 0 0 23 23" />
        </>
      )
  }
}

export function ClassEmblem({ characterClass }: ClassEmblemProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {classSymbol(characterClass)}
    </svg>
  )
}
