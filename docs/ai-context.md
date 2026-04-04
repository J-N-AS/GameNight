# AI context

## Repo kort fortalt

GameNight er en statisk-first Next.js-app for festspill og relaterte innholdssider. Produktet er bygget for én skjerm per spilløkt og henter nesten alt innhold fra lokale filer i `src/data/`.

Les `docs/GAMENIGHT_MASTER.md` først hvis du trenger helheten. Denne filen er bare en kortversjon.

## Hvor ting ligger

- spill: `src/data/*.json`
- temaer: `src/data/themes.json`
- drikkelek-artikler: `src/data/drikkeleker.json`
- bibliotekslasting: `src/lib/games.ts`
- tiering/anbefalinger: `src/lib/game-library.ts`
- gameplay-logikk: `src/components/game/GameFlow.tsx`, `src/components/game/GameClient.tsx`
- gameplay-presentasjon: `src/components/game/TaskCard.tsx`
- SEO: `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`

## Hvordan gameplay faktisk fungerer

- `GameFlow` bestemmer preplay-steg og skjuler footer/related når gameplay er aktivt
- `GameClient` kjører fullscreen-shellen og bruker tap-to-advance som hovedmekanikk
- spillerliste og enkel statistikk ligger i `localStorage`
- kort støtter `type`, `text`, valgfri `rule`, `moment`, `timer`, `sipAmount` og `penalty`

Viktig realitet:

- `timer` er live i immersive gameplay
- `rule` er live som kortinnhold, men aktive regler spores ikke i standard gameplay
- `sipAmount` og `penalty` finnes i modellen, men er ikke fullt koblet inn i dagens immersive runtime
- drikkenivå-preferanser og `GameStartDialog` finnes som scaffolding, men brukes ikke i vanlig startflyt

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

Navn skjules med vilje i `pointing` og `never_have_i_ever`, hvor motoren kan vise `Noen` og `En annen`.

## Hvordan nye spill legges til

1. lag `src/data/<id>.json`
2. legg ID-en i `canonicalGameIds` i `src/lib/games.ts`
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
- ikke anta at alle schemafelt er live i gameplay bare fordi de finnes
- ikke legg inn store “Neste”-knapper i normal gameplay-flyt
- vær tydelig på at oppsummeringen bygger på enkel lokal statistikk, ikke full tracking
- husk at dagens repo har aktiv consent-/ad-gating og at dette påvirker UX

## Dokumenter som bør leses først

- `docs/GAMENIGHT_MASTER.md`
- `docs/02-architecture.md`
- `docs/03-game-system.md`
- `docs/04-game-library.md`
- `docs/05-gameplay-design.md`
- `docs/07-seo-strategy.md`
