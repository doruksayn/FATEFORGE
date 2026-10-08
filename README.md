<div align="center">
  <a href="https://doruksayn.github.io/FATEFORGE/">
    <img src="./public/branding/wow-forever-logo.png" alt="World of Warcraft: WoW Forever" width="420" />
  </a>

  <h1>FATEFORGE</h1>
  <p><strong>Three tools. A thousand possible adventures.</strong></p>
  <p>Roll a character, forge a name, or check WoW Forever server connectivity.</p>

  <a href="https://doruksayn.github.io/FATEFORGE/">Open FATEFORGE</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/doruksayn/FATEFORGE">View source</a>

  <br />

  <a href="https://github.com/doruksayn/FATEFORGE/actions/workflows/deploy.yml"><img src="https://github.com/doruksayn/FATEFORGE/actions/workflows/deploy.yml/badge.svg" alt="GitHub Pages deployment status" /></a>
</div>

## Choose your tool

| Tool | What it does | Open directly |
|---|---|---|
| **Character Randomizer** | Roll a compatible faction, race, class, gender, and character name. | [`#/character`](https://doruksayn.github.io/FATEFORGE/#/character) |
| **Name Generator** | Choose a character context, generate a name, and reroll either name part or both. | [`#/names`](https://doruksayn.github.io/FATEFORGE/#/names) |
| **Server Status** | See login and realm connectivity, recent uptime, and WoW: Forever news. | [`#/status`](https://doruksayn.github.io/FATEFORGE/#/status) |

Faction, race, and class choices stay within valid WoW Forever combinations. Both character tools let you browse, restore, remove, and page through up to 20 recent results; each tool keeps its own history in your browser.

### Class-influenced surnames

Enable this option in either character tool to give surnames a class flavor. It uses a matching Race/Class surname pool for 35% of surname rolls. See all current pools in **[NAME_POOLS.md](./NAME_POOLS.md)**.

### Server status data

GitHub Actions checks the login service and game realm every five minutes. The page shows the latest result and the last 24 hours of history. These checks only confirm that each server accepts a network connection; they do not verify sign-in or gameplay. News headlines come from Icy Veins and link to the original articles.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

| Command | Purpose |
|---|---|
| `npm test` | Run logic, storage, and news parser tests |
| `npm run lint` | Check the code with Oxlint |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |

The character tools run in the browser and need no application backend. Recent names are stored separately in browser storage. Server status is read from the public `status-data` branch; GitHub Actions maintains that data and fetches the Icy Veins feed.

## Deployment

Pushing to `main` builds and deploys the site to [GitHub Pages](https://doruksayn.github.io/FATEFORGE/) through [GitHub Actions](https://github.com/doruksayn/FATEFORGE/actions/workflows/deploy.yml). For a fresh setup, select **Settings → Pages → Build and deployment → GitHub Actions** as the publishing source.

## Disclaimer

FATEFORGE is an unofficial fan project. World of Warcraft and related assets are property of Blizzard Entertainment. FATEFORGE is not affiliated with, sponsored by, or endorsed by Blizzard Entertainment.
