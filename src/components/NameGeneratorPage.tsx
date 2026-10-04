import { useState } from 'react'
import { ClassIcon } from './ClassIcon.tsx'
import { generateCharacter, getValidClasses, getValidCombinations, getValidFactions, getValidRaces } from '../logic/randomizer.ts'
import { generateFirstName, generateFullName, generateSurname, type CharacterName } from '../logic/nameGenerator.ts'
import { getRaceDisplayName } from '../presentation/raceName.ts'
import { RANDOM, type Character, type CharacterFilters, type RandomOption } from '../types/character.ts'
import { RecentRolls } from './RecentRolls.tsx'
import { SelectionControl } from './SelectionControl.tsx'
import { clampHistoryPage } from '../logic/historyPagination.ts'
import { createHistoryEntry, prependHistoryEntry, removeHistoryEntry, updateHistoryName, type RollHistoryEntry } from '../storage/history.ts'

export function NameGeneratorPage() {
  const [race, setRace] = useState<RandomOption<Character['race']>>(RANDOM)
  const [characterClass, setCharacterClass] = useState<RandomOption<Character['class']>>(RANDOM)
  const [gender, setGender] = useState<RandomOption<Character['gender']>>(RANDOM)
  const [faction, setFaction] = useState<RandomOption<Character['faction']>>(RANDOM)
  const [character, setCharacter] = useState<Character | null>(null)
  const [name, setName] = useState<CharacterName | null>(null)
  const [history, setHistory] = useState<RollHistoryEntry[]>([])
  const [historyPage, setHistoryPage] = useState(1)
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null)
  const [restoreFrame, setRestoreFrame] = useState(0)

  const filters: CharacterFilters = { faction, race, class: characterClass }
  const factions = getValidFactions(filters)
  const races = getValidRaces(filters)
  const classes = getValidClasses(filters)

  function generate() {
    const result = generateCharacter({ ...filters, gender })
    if (!result) return
    const nextName = generateFullName(result.race, result.gender)
    const entry = createHistoryEntry(result, nextName)
    setCharacter(result)
    setName(nextName)
    setCurrentHistoryId(entry.id)
    setHistory((entries) => prependHistoryEntry(entries, entry))
    setHistoryPage(1)
  }

  function updateName(nextName: CharacterName) {
    setName(nextName)
    const id = currentHistoryId
    if (id) setHistory((entries) => updateHistoryName(entries, id, nextName))
  }

  function updateSelection(key: 'faction' | 'race' | 'class', value: RandomOption<Character['faction' | 'race' | 'class']>) {
    const next: CharacterFilters = { faction, race, class: characterClass }
    if (key === 'faction') next.faction = value as typeof faction
    if (key === 'race') next.race = value as typeof race
    if (key === 'class') next.class = value as typeof characterClass
    for (const dependent of ['race', 'class', 'faction'] as const) {
      if (dependent !== key && next[dependent] !== RANDOM && !getValidCombinations(next).length) next[dependent] = RANDOM
    }
    if (!getValidCombinations(next).length) {
      next.faction = RANDOM
      next.race = RANDOM
      next.class = RANDOM
    }
    setFaction(next.faction ?? RANDOM)
    setRace(next.race ?? RANDOM)
    setCharacterClass(next.class ?? RANDOM)
  }

  function rerollFirst() {
    if (character && name) updateName({ ...name, firstName: generateFirstName(character.race, character.gender) })
  }

  function rerollSurname() {
    if (character && name) updateName({ ...name, surname: generateSurname(character.race) })
  }

  function rerollFull() {
    if (character) updateName(generateFullName(character.race, character.gender))
  }

  function clearHistory() {
    setHistory([])
    setHistoryPage(1)
    setCurrentHistoryId(null)
  }

  function removeHistory(id: string) {
    if (currentHistoryId === id) setCurrentHistoryId(null)
    const next = removeHistoryEntry(history, id)
    setHistory(next)
    setHistoryPage((page) => clampHistoryPage(page, next.length))
  }

  function selectHistoryEntry(entry: RollHistoryEntry) {
    setFaction(entry.faction)
    setRace(entry.race)
    setCharacterClass(entry.class)
    setGender(entry.gender)
    setCharacter({ faction: entry.faction, race: entry.race, class: entry.class, gender: entry.gender })
    setName({ firstName: entry.firstName, surname: entry.surname })
    setCurrentHistoryId(entry.id)
    setRestoreFrame((frame) => frame + 1)
  }

  return (
    <div className="app-shell name-generator-shell">
      <div className="name-page-heading"><p className="section-kicker">WoW Forever Tools</p><h1>NAME GENERATOR</h1><p>Forge a name for your next character.</p></div>
      <div className="generator-layout">
        <section className="selection-panel" aria-labelledby="name-options-heading">
          <span className="card-edge-flow" aria-hidden="true" />
          <div className="panel-heading"><div><p className="section-kicker">Forge your legend</p><h2 id="name-options-heading">Name Options</h2></div></div>
          <div className="selection-grid name-selection-grid">
            <SelectionControl id="name-faction" label="Faction" value={faction} options={factions} disabled={false} onChange={(value) => updateSelection('faction', value)} />
            <SelectionControl id="name-race" label="Race" value={race} options={races} disabled={false} onChange={(value) => updateSelection('race', value)} />
            <SelectionControl id="name-class" label="Class" value={characterClass} options={classes} disabled={false} onChange={(value) => updateSelection('class', value)} />
            <SelectionControl id="name-gender" label="Gender" value={gender} options={['Male', 'Female']} disabled={false} onChange={setGender} />
          </div>
          <p className="selection-note">Faction, Race and Class options update to stay compatible. Leave choices Random to let fate decide.</p>
          <button className="roll-button" type="button" onClick={generate}>✦ Generate Name</button>
        </section>
        <section className={`result-card name-result-card${character ? ` result-card--${character.faction.toLowerCase()}` : ' name-result-card--empty result-card--empty'}`} aria-labelledby="name-result-heading" aria-live="polite">
          <span className="card-edge-flow" aria-hidden="true" />
          {character && name ? <div key={restoreFrame} className={`character-result${restoreFrame ? ' name-result-restored' : ''}`}>
            <p className="result-faction">{character.faction}</p>
            <h2 id="name-result-heading">{getRaceDisplayName(character.race)}</h2>
            <div className="result-rule" aria-hidden="true">✦</div>
            <div className="class-medallion"><ClassIcon characterClass={character.class} /></div>
            <p className="result-class">{character.class}</p><p className="result-gender">{character.gender}</p>
            <div className="name-section"><div className="name-divider" aria-hidden="true">✦</div><p className="name-label">Your name</p><p className="character-name"><span>{name.firstName}</span> <span>{name.surname}</span></p>
              <div className="name-actions">
                <button type="button" onClick={rerollFirst}><span aria-hidden="true">↻</span>First Name</button>
                <button type="button" onClick={rerollSurname}><span aria-hidden="true">↻</span>Surname</button>
                <button type="button" onClick={rerollFull}><span aria-hidden="true">↻</span>Full Name</button>
              </div>
            </div>
          </div> : <div className="result-empty"><span className="empty-sigil" aria-hidden="true">✧</span><h2 id="name-result-heading">Your name awaits.</h2><p>Choose your path, then forge a name for your next character.</p></div>}
        </section>
      </div>
      <RecentRolls entries={history} page={historyPage} onPageChange={setHistoryPage} onClear={clearHistory} onRemove={removeHistory} title="Recent Names" hint="Select a name to bring it back to the result card." onSelectEntry={selectHistoryEntry} selectedEntryId={currentHistoryId} />
    </div>
  )
}
