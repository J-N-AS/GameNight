# Game library

## Hvor spillene ligger

GameNight er et data-drevet spillbibliotek. Hvert spill ligger som egen JSON-fil i `src/data/`.

Eksempler:

- `src/data/party-klassikere.json`
- `src/data/spinn-flasken.json`
- `src/data/sannhet-eller-shot.json`

Selve biblioteket styres av to filer:

- `src/lib/games.ts` bestemmer hvilke spill-ID-er som lastes
- `src/lib/game-library.ts` bestemmer tiering og anbefalte spill

## Bibliotekets nivåer

Biblioteket har tre praktiske nivåer:

### Kjernevalg

Spill som prioriteres i sortering og anbefalinger.

### Offentlige temaspill

Spill som fortsatt er synlige, men som er mer nisje- eller situasjonsstyrte.

### Skjulte spill

Spill som enten:

- er skjult helt med `hidden`
- er skjult fra hovedbiblioteket med `isHiddenFromMain`
- brukes som custom-/legacy- eller preset-ruter

## Spillfilens struktur

Et typisk spill ser slik ut:

```json
{
  "id": "eksempel-spill",
  "title": "Eksempelspill",
  "description": "Kort beskrivelse av stemning og brukssituasjon.",
  "language": "no",
  "shuffle": true,
  "requiresPlayers": true,
  "emoji": "🎉",
  "intensity": "medium",
  "audience": "all",
  "category": ["Party"],
  "tags": ["Anbefalt"],
  "items": [
    { "type": "challenge", "text": "{player}, si tre dyr på fem sekunder." }
  ]
}
```

## Felt som brukes aktivt

### På spillnivå

- `id` må matche filnavn og ID-en som legges i `allGameIds`
- `title` og `description` brukes i bibliotek, metadata og relaterte lister
- `shuffle` avgjør om kortene stokkes
- `requiresPlayers` og `minPlayers` styrer spillerkrav
- `emoji`, `intensity`, `audience`, `category` og `tags` brukes i biblioteket
- `warning` gir samtykkeskjerm før spillstart
- `gameType` og `spinMode` styrer spesialflyt
- `hidden` og `isHiddenFromMain` styrer synlighet
- `custom`, `region`, `kommune` og `instagram` brukes på russe-/custom-flater

### På kortnivå

- `type` og `text` er alltid obligatoriske
- `rule` brukes bare når kortet skal leve videre som running rule
- `moment` brukes bare når kortet fortjener reveal som impact moment

## Hvordan legge til et nytt spill

1. Lag `src/data/<spill-id>.json`
2. Legg ID-en inn i `allGameIds` i `src/lib/games.ts`
3. Velg tier i `src/lib/game-library.ts` hvis spillet skal være kjernevalg eller skjult
4. Legg spillet inn i `src/data/themes.json` hvis det skal vises på temasider
5. Oppdater `SPILL_OVERSIKT.md`
6. Test at `/spill/<spill-id>` bygger og fungerer

## Når du bør bruke spesialfelter

Bruk `warning` når spillet krever tydelig samtykke eller har mer sensitiv tone.

Bruk `gameType` bare når standardflyten ikke er nok:

- `spin-the-bottle` når en flaske styrer hvem som gjør noe
- `physical-item` når en fysisk gjenstand er del av spillet
- `versus` bare når du faktisk trenger lagpoeng og vinnerknapper

Bruk `hidden` eller `isHiddenFromMain` når:

- spillet er legacy
- spillet er for spesifikt til hovedbiblioteket
- spillet bare skal leve via spesialside eller direkte lenke

## Hva som også må vurderes ved nye spill

### Spillerkrav

Hvis spillet egentlig trenger flere enn 2 spillere, sett `minPlayers` eksplisitt. Ikke stol på implicit oppførsel hvis kortene er avhengige av flere roller.

### Gameplay-passform

Nye spill bør passe dagens motor:

- korte, høytlesbare kort
- enkel sosial håndheving
- begrenset behov for kompliserte lag- eller rollemodeller

### SEO og katalog

Et spill blir ikke automatisk synlig i riktig sammenheng bare fordi JSON-filen finnes. Vurder:

- bør det være offentlig eller skjult?
- skal det inn i temaer?
- skal det være del av kjernebiblioteket?

## Nærliggende innholdstyper

Spillbiblioteket er bare én del av innholdslaget.

- temaer styres i `src/data/themes.json`
- drikkelek-artikler styres i `src/data/drikkeleker.json`
- musikk- og skjermleker har egne JSON-filer

Se `07-seo-strategy.md` for hvordan disse inngår i distribusjonslaget.
