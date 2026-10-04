# FATEFORGE

A WoW Forever character randomizer for choosing a faction, race, class, gender, and original fantasy name.

## Features

- Random or manually locked faction, race, class, and gender selections
- Dependency-aware generation of valid WoW Forever character combinations
- Animated character roulette
- Local class icons
- Race- and gender-aware fantasy name generator with separate name rerolls
- Persistent Recent Rolls history saved in the browser
- Paginated history with individual and full-history deletion
- Responsive desktop and mobile layout

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Browser `localStorage`
- GitHub Pages

## Running Locally

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm test
npm run lint
npm run build
```

## Deployment

GitHub Actions builds and deploys the `main` branch to GitHub Pages. Enable **Settings → Pages → Build and deployment → Source → GitHub Actions** in the repository. A manual deployment can also be started from the Actions tab.

## Data and Compatibility

Faction, race, and class compatibility data is maintained locally in the project. Update it when WoW Forever's playable combinations change. The name generator uses local race- and gender-specific name pools.

Roll history is stored in this browser under the versioned key `wow-forever-roulette.history.v1`. It is not synced between browsers or devices.

## Disclaimer

This is an unofficial fan project. World of Warcraft and related assets are property of Blizzard Entertainment. FATEFORGE is not affiliated with, sponsored by, or endorsed by Blizzard Entertainment.
