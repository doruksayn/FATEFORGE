import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  getValidClasses,
  getValidCombinations,
  getValidFactions,
  getValidGenders,
  getValidRaces,
  generateCharacter,
} from './logic/randomizer.ts'
import {
  RANDOM,
  type Character,
  type CharacterSelection,
} from './types/character.ts'
import { ClassIcon } from './components/ClassIcon.tsx'
import { RecentRolls } from './components/RecentRolls.tsx'
import { getRaceDisplayName } from './presentation/raceName.ts'
import { generateFirstName, generateFullName, generateSurname, type CharacterName } from './logic/nameGenerator.ts'
import { clampHistoryPage } from './logic/historyPagination.ts'
import {
  clearPersistedHistory,
  createHistoryEntry,
  loadHistory,
  persistHistory,
  prependHistoryEntry,
  removeHistoryEntry,
  updateHistoryName,
  type RollHistoryEntry,
} from './storage/history.ts'
import './App.css'
import { NameGeneratorPage } from './components/NameGeneratorPage.tsx'
import { getToolFromHash } from './logic/toolRoute.ts'
import { SelectionControl } from './components/SelectionControl.tsx'

const WOW_FOREVER_OFFICIAL_URL = 'https://worldofwarcraft.blizzard.com/en-us/forever'
const MAIN_BACKGROUND_URL = new URL(
  `${import.meta.env.BASE_URL}backgrounds/main-bg.jpg`,
  document.baseURI,
).href
const socialLinks = [
  { name: 'Kick', href: 'https://kick.com/doruksayn', image: 'kick.png' },
  { name: 'YouTube', href: 'https://www.youtube.com/@doruksayn', image: 'youtube.png' },
  { name: 'GitHub', href: 'https://github.com/doruksayn', image: 'github.png' },
] as const

const initialSelection: CharacterSelection = {
  faction: RANDOM,
  race: RANDOM,
  class: RANDOM,
  gender: RANDOM,
}

const rouletteDelays = [55, 70, 85, 110, 145, 190, 245, 340] as const

function App() {
  const [activeTool, setActiveTool] = useState(() => getToolFromHash(window.location.hash))
  const [logoFailed, setLogoFailed] = useState(false)
  const [selection, setSelection] = useState(initialSelection)
  const [result, setResult] = useState<Character | null>(null)
  const [hasRolled, setHasRolled] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [rollFrame, setRollFrame] = useState(0)
  const [isSettled, setIsSettled] = useState(false)
  const [characterName, setCharacterName] = useState<CharacterName | null>(null)
  const [classSurnameInfluence, setClassSurnameInfluence] = useState(false)
  const [history, setHistory] = useState<RollHistoryEntry[]>(loadHistory)
  const [historyPage, setHistoryPage] = useState(1)
  const historyRef = useRef(history)
  const rollingRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const currentHistoryIdRef = useRef<string | null>(null)

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    rollingRef.current = false
  }, [])

  useEffect(() => {
    const syncHash = () => {
      const tool = getToolFromHash(window.location.hash)
      if (window.location.hash !== `#/${tool}`) window.history.replaceState(null, '', '#/character')
      setActiveTool(tool)
    }
    window.addEventListener('hashchange', syncHash)
    syncHash()
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const validCombinations = getValidCombinations(selection)
  const canRoll = validCombinations.length > 0

  function commitHistory(next: RollHistoryEntry[]) {
    historyRef.current = next
    setHistory(next)
    setHistoryPage((page) => clampHistoryPage(page, next.length))
    persistHistory(next)
  }

  function recordSettledCharacter(character: Character, name: CharacterName) {
    const entry = createHistoryEntry(character, name)
    currentHistoryIdRef.current = entry.id
    setHistoryPage(1)
    commitHistory(prependHistoryEntry(historyRef.current, entry))
  }

  function setCurrentName(name: CharacterName) {
    setCharacterName(name)
    const entryId = currentHistoryIdRef.current
    if (!entryId) return
    commitHistory(updateHistoryName(historyRef.current, entryId, name))
  }

  function clearHistory() {
    historyRef.current = []
    setHistory([])
    setHistoryPage(1)
    clearPersistedHistory()
    currentHistoryIdRef.current = null
  }

  function removeHistory(id: string) {
    if (currentHistoryIdRef.current === id) currentHistoryIdRef.current = null
    commitHistory(removeHistoryEntry(historyRef.current, id))
  }

  function updateSelection<K extends keyof CharacterSelection>(
    key: K,
    value: CharacterSelection[K],
  ) {
    if (rollingRef.current) return
    const next = { ...selection, [key]: value } as CharacterSelection

    // Keep the newly changed choice, then unlock conflicting selections in a stable order.
    for (const dependent of ['race', 'class', 'faction'] as const) {
      if (dependent === key || next[dependent] === RANDOM) continue
      if (getValidCombinations(next).length === 0) next[dependent] = RANDOM
    }

    // A valid option list should prevent this; retain a safe fallback if data changes later.
    if (getValidCombinations(next).length === 0) {
      next.faction = RANDOM
      next.race = RANDOM
      next.class = RANDOM
    }

    setSelection(next)
    setResult(null)
    setCharacterName(null)
    setHasRolled(false)
    setIsSettled(false)
  }

  function rollCharacter() {
    if (rollingRef.current) return
    const generated = generateCharacter(selection)
    if (!generated) return
    const finalCharacter: Character = generated

    rollingRef.current = true
    setRolling(true)
    setHasRolled(true)
    setIsSettled(false)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setResult(finalCharacter)
      const name = generateFullName(finalCharacter.race, finalCharacter.gender, { characterClass: finalCharacter.class, classInfluence: classSurnameInfluence })
      setCharacterName(name)
      recordSettledCharacter(finalCharacter, name)
      setRollFrame((frame) => frame + 1)
      setRolling(false)
      setIsSettled(true)
      rollingRef.current = false
      return
    }

    let previousCharacter: Character | null = result
    function nextPreview(): Character {
      let preview: Character = generateCharacter(selection) ?? finalCharacter
      for (let attempt = 0; attempt < 4 && sameCharacter(preview, previousCharacter); attempt++) {
        preview = generateCharacter(selection) ?? finalCharacter
      }
      previousCharacter = preview
      return preview
    }

    function advance(step: number) {
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        if (step === rouletteDelays.length - 1) {
          setResult(finalCharacter)
          const name = generateFullName(finalCharacter.race, finalCharacter.gender, { characterClass: finalCharacter.class, classInfluence: classSurnameInfluence })
          setCharacterName(name)
          recordSettledCharacter(finalCharacter, name)
          setRollFrame((frame) => frame + 1)
          setRolling(false)
          setIsSettled(true)
          rollingRef.current = false
          return
        }

        setResult(nextPreview())
        setRollFrame((frame) => frame + 1)
        advance(step + 1)
      }, rouletteDelays[step])
    }

    advance(0)
  }

  function rerollFirstName() {
    if (!result || rolling || !characterName) return
    setCurrentName({ ...characterName, firstName: generateFirstName(result.race, result.gender) })
  }

  function rerollSurname() {
    if (!result || rolling || !characterName) return
    setCurrentName({ ...characterName, surname: generateSurname(result.race, { characterClass: result.class, classInfluence: classSurnameInfluence }) })
  }

  function rerollFullName() {
    if (!result || rolling) return
    setCurrentName(generateFullName(result.race, result.gender, { characterClass: result.class, classInfluence: classSurnameInfluence }))
  }

  const resultFactionClass = result
    ? ` result-card--${result.faction.toLowerCase()}`
    : ''
  const resultClassName = `result-card${resultFactionClass}${result ? '' : ' result-card--empty'}${rolling ? ' result-card--rolling' : ''}${isSettled ? ' result-card--settled' : ''}`

  return (
    <>
    <header className="top-header" id="top">
      <div className="top-header-inner">
      <div className="masthead-brand">
        <a
          className="masthead-logo-link"
          href={window.location.href}
          aria-label="Refresh this page"
          onClick={(event) => { event.preventDefault(); window.location.reload() }}
        >
          {logoFailed ? (
            <span className="brand-fallback">WOW FOREVER</span>
          ) : (
            <img
              className="brand-logo"
              src={import.meta.env.BASE_URL + 'branding/wow-forever-logo.png'}
              alt="WoW Forever"
              onError={() => setLogoFailed(true)}
            />
          )}
        </a>
        <div className="masthead-title">
          <h1><a className="masthead-title-link" href="#top">FATEFORGE</a></h1>
        </div>
      </div>
      <nav className="tool-nav" aria-label="FATEFORGE tools">
        <a href="#/character" aria-current={activeTool === 'character' ? 'page' : undefined}>Character Randomizer</a>
        <a href="#/names" aria-current={activeTool === 'names' ? 'page' : undefined}>Name Generator</a>
      </nav>
      </div>
    </header>
    <main
      className="main-content"
      style={{ '--main-bg-image': `url("${MAIN_BACKGROUND_URL}")` } as CSSProperties}
    >
    <div className={activeTool === 'names' ? 'tool-view' : 'tool-view tool-view--inactive'} aria-hidden={activeTool !== 'names'} inert={activeTool !== 'names'}><NameGeneratorPage /></div>
    <div className={`${activeTool === 'character' ? 'tool-view character-tool' : 'tool-view character-tool tool-view--inactive'}`} aria-hidden={activeTool !== 'character'} inert={activeTool !== 'character'}>
    <div className="app-shell">
      <div className="name-page-heading"><p className="section-kicker">WoW Forever Tools</p><h1>CHARACTER RANDOMIZER</h1><p>Choose your path and let fate decide.</p></div>
      <div className="generator-layout">
        <section className="selection-panel" aria-labelledby="selection-heading">
          <span className="card-edge-flow" aria-hidden="true" />
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Shape your fate</p>
              <h2 id="selection-heading">Character Options</h2>
            </div>
          </div>

          <div className="selection-grid">
            <SelectionControl
              id="faction"
              label="Faction"
              value={selection.faction}
              disabled={rolling}
              options={getValidFactions(selection)}
              onChange={(value) => updateSelection('faction', value)}
            />
            <SelectionControl
              id="race"
              label="Race"
              value={selection.race}
              disabled={rolling}
              options={getValidRaces(selection)}
              onChange={(value) => updateSelection('race', value)}
            />
            <SelectionControl
              id="class"
              label="Class"
              value={selection.class}
              disabled={rolling}
              options={getValidClasses(selection)}
              onChange={(value) => updateSelection('class', value)}
            />
            <SelectionControl
              id="gender"
              label="Gender"
              value={selection.gender}
              disabled={rolling}
              options={getValidGenders(selection)}
              onChange={(value) => updateSelection('gender', value)}
            />
          </div>

          <p className="selection-note">Faction, Race and Class options update to stay compatible. Leave choices Random to let fate decide.</p>
          <label className={`class-influence-toggle${classSurnameInfluence ? ' class-influence-toggle--enabled' : ''}`}><input type="checkbox" checked={classSurnameInfluence} onChange={(event) => setClassSurnameInfluence(event.target.checked)} /><span className="class-influence-copy"><strong>Class-Influenced Surnames</strong><small>When enabled, 35% of surname rolls use the class pool.</small></span></label>
          <button
            className={`roll-button${rolling ? ' roll-button--rolling' : ''}`}
            type="button"
            onClick={rollCharacter}
            disabled={!canRoll || rolling}
          >
            <span className={rolling ? 'roll-icon roll-icon--spinning' : ''} aria-hidden="true">✦</span>
            {rolling ? 'The Wheel Turns…' : hasRolled ? 'Roll Again' : 'Roll Character'}
          </button>
        </section>

        <section
          className={resultClassName}
          aria-labelledby="result-heading"
          aria-busy={rolling}
          aria-live="off"
        >
          <span className="card-edge-flow" aria-hidden="true" />
          {result ? (
            <div className="character-result" key={`${rolling ? 'rolling' : 'revealed'}-${rollFrame}`}>
              <p className="result-faction">{result.faction}</p>
              <h2 id="result-heading" aria-label={result.race}>{getRaceDisplayName(result.race)}</h2>
              <div className="result-rule" aria-hidden="true"><span>✦</span></div>
              <div className="class-medallion" aria-hidden="true">
                <ClassIcon characterClass={result.class} />
              </div>
              <p className="result-class">{result.class}</p>
              <p className="result-gender">{result.gender}</p>
              {characterName && (
                <div className="name-section" aria-label="Character name" aria-hidden={rolling}>
                  <div className="name-divider" aria-hidden="true"><span>✦</span></div>
                  <p className="name-label">Character name</p>
                  <p className="character-name" aria-live="polite">
                    <span>{characterName.firstName}</span> <span>{characterName.surname}</span>
                  </p>
                  <div className="name-actions">
                    <button type="button" onClick={rerollFirstName} disabled={rolling}><span aria-hidden="true">↻</span>First Name</button>
                    <button type="button" onClick={rerollSurname} disabled={rolling}><span aria-hidden="true">↻</span>Surname</button>
                    <button type="button" onClick={rerollFullName} disabled={rolling}><span aria-hidden="true">↻</span>Full Name</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="result-empty">
              <span className="empty-sigil" aria-hidden="true">✧</span>
              <h2 id="result-heading">Your fate awaits.</h2>
              <p>When you are ready, cast the die and meet your next adventurer.</p>
            </div>
          )}
          {result && (
            <div className="result-card-footer" aria-hidden={rolling}>
              <span aria-hidden="true">✦</span>
              <span>One path among many</span>
              <span aria-hidden="true">✦</span>
            </div>
          )}
        </section>
      </div>
      <RecentRolls entries={history} page={historyPage} onPageChange={setHistoryPage} onClear={clearHistory} onRemove={removeHistory} />
      <p className="sr-only" role="status" aria-live="polite">
        {rolling
          ? 'The character roulette is in progress.'
          : result
            ? `${result.faction}, ${result.race}, ${result.class}, ${result.gender}.`
            : ''}
      </p>
    </div>
    </div>
    </main>
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-main-row">
          <p className="footer-made">Made by <strong>doruksayn</strong></p>
          <div className="footer-project">
            {WOW_FOREVER_OFFICIAL_URL ? (
              <a className="footer-project-name" href={WOW_FOREVER_OFFICIAL_URL} target="_blank" rel="noopener noreferrer">
                WoW Forever
              </a>
            ) : (
              <span className="footer-project-name">WoW Forever</span>
            )}
            <span className="footer-project-note">Unofficial Fan Project</span>
          </div>
          <div className="footer-links">
            {socialLinks.map((social) => (
              <a
                className={`footer-social-link footer-social-link--${social.name.toLowerCase()}`}
                href={social.href}
                key={social.name}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${social.name} profile in a new tab`}
                title={social.name}
              >
                <img src={import.meta.env.BASE_URL + `branding/${social.image}`} alt="" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <p className="footer-disclaimer">
          World of Warcraft and related assets are property of Blizzard Entertainment. This is an unofficial fan project.
        </p>
      </div>
    </footer>
    </>
  )
}

function sameCharacter(first: Character | null, second: Character | null): boolean {
  return first !== null && second !== null &&
    first.faction === second.faction && first.race === second.race &&
    first.class === second.class && first.gender === second.gender
}

export default App
