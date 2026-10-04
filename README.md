# FATEFORGE

FATEFORGE is a two-tool character companion for WoW Forever. Use the Character Randomizer to roll a valid character, or shape a character context and forge a name with the Name Generator.

## Tools

### Character Randomizer

- Roll a character with random or fixed Faction, Race, Class, and Gender choices.
- Browse valid combinations through linked selectors. Incompatible choices are cleared automatically.
- Watch the character roulette reveal its result.
- Reroll the first name, surname, or full name without changing the character.
- Review, remove, and page through the latest 20 rolls.
- Recent Rolls are saved in browser `localStorage`.

### Name Generator

- Choose Random or fixed Faction, Race, Class, and Gender.
- Race and Class options follow the same compatibility data as the Character Randomizer.
- Generate a first name and surname using the selected Race and Gender. Class provides context but does not affect name style.
- Reroll either part of the name or both while keeping the character context.
- Browse, select, remove, and page through recent names. Selecting a name restores its result and selector values.
- Recent Names are kept in memory for the current session and are not saved to `localStorage`.

## Navigation

The tools use lightweight hash navigation and need no routing dependency:

- `#/character` — Character Randomizer
- `#/names` — Name Generator

The current tool is preserved when the page is refreshed. Empty and unknown hashes default to the Character Randomizer. Browser Back and Forward move between tools.

## Development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Useful project checks:

```bash
npm test
npm run lint
npm run build
```

`npm run preview` serves the production build locally after `npm run build`.

## Project Structure

- `src/data/compatibility.ts` — faction, race, and class combinations
- `src/data/names.ts` — local race and gender name pools
- `src/logic/randomizer.ts` — compatibility queries and character generation
- `src/logic/nameGenerator.ts` — first-name and surname generation
- `src/storage/history.ts` — validated Character Randomizer history storage
- `src/components/` — tool pages and shared interface components

All character and name generation runs locally in the browser. FATEFORGE has no backend or external name-generation service.

## Deployment

GitHub Actions builds and deploys the `main` branch to GitHub Pages. In the repository settings, select **Settings → Pages → Build and deployment → GitHub Actions** as the publishing source.

## Disclaimer

FATEFORGE is an unofficial fan project. World of Warcraft and related assets are property of Blizzard Entertainment. FATEFORGE is not affiliated with, sponsored by, or endorsed by Blizzard Entertainment.
