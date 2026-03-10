# AI context

## Repo kort fortalt

GameNight er en statisk-first Next.js-app for festspill og relaterte innholdssider. Produktet er bygget for én skjerm per spilløkt og henter nesten alt innhold fra lokale filer i `src/data/`.

## Hvor ting ligger

- spill: `src/data/*.json`
- temaer: `src/data/themes.json`
- drikkelek-artikler: `src/data/drikkeleker.json`
- bibliotekslasting: `src/lib/games.ts`
- tiering/anbefalinger: `src/lib/game-library.ts`
- gameplay-logikk: `src/components/game/GameFlow.tsx`, `src/components/game/GameClient.tsx`
- gameplay-presentasjon: `src/components/game/TaskCard.tsx`
- SEO: `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`

## Hvordan gameplay fungerer

- `GameFlow` bestemmer oppstartssteget og skjuler footer/related når `step === "playing"`
- `GameClient` kjører kortstokken og holder session-lokal state
- kort støtter `type`, `text`, valgfri `rule` og valgfri `moment`
- `rule` og `moment` brukes nå hovedsakelig som redaksjonell metadata og kortpresentasjon
- spillerliste og enkel statistikk ligger i `localStorage`

Støttede korttyper:

- `challenge`
- `never_have_i_ever`
- `prompt`
- `pointing`
- `versus`
- `truth_or_shot`

Støttede placeholders:

- `{player}`
- `{player2}`
- `{team1}`
- `{team2}`
- `{all}`

## Hvordan nye spill legges til

1. lag `src/data/<id>.json`
2. legg ID-en i `src/lib/games.ts`
3. oppdater `src/lib/game-library.ts` hvis tiering eller anbefalinger skal endres
4. legg spillet til i `themes.json` hvis det skal vises i temaer
5. oppdater `SPILL_OVERSIKT.md`

## Hvordan nye innholdssider legges til

- ny temaside: `src/data/themes.json`
- ny drikkelek-artikkel: `src/data/drikkeleker.json` og eventuelt `src/lib/placeholder-images.json`

## Viktige guardrails

- ikke anta database, auth eller backend
- behold én-enhets-modellen med mindre noe annet er bestilt
- foretrekk data-drevne endringer fremfor nye spesialsystemer
- ikke legg inn ekstra paneler eller støtte-UI i aktiv spilling uten eksplisitt behov
- ikke gjør `versus` til standardmønster; dagens støtte er smal
- vær tydelig på at oppsummeringen bygger på enkel lokal statistikk, ikke full tracking

## Dokumenter som bør leses først

- `docs/02-architecture.md`
- `docs/03-game-system.md`
- `docs/04-game-library.md`
- `docs/05-gameplay-design.md`
- `docs/07-seo-strategy.md`
