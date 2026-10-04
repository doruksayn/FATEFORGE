import './App.css'

function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Azeroth awaits</p>
      <h1>WoW Forever Character Roulette</h1>
      <p className="intro">
        Your next adventure starts with a character. Compatibility data and the
        randomizer will be added once the WoW Forever rules are verified.
      </p>
      <section className="placeholder" aria-label="Character generator status">
        <span className="placeholder-icon" aria-hidden="true">✦</span>
        <h2>The wheel is waiting</h2>
        <p>Faction, race, class, and gender options will appear here.</p>
      </section>
    </main>
  )
}

export default App
