# Game system

## Oversikt

GameNight bruker en lett, klientdrevet spillmotor for én delt skjerm. Spillene er data-drevne og ligger som JSON-deck i `src/data/`, mens runtime-logikken bor i `GameFlow`, `GameClient` og `TaskCard`.

Det viktigste å forstå er:

- gameplay er bygd for rask oppstart
- én skjerm styrer hele runden
- selve kortet er hoved-UI
- ikke alle felter i schema er fullt koblet inn i dagens immersive gameplay

## Spillflyt

Hovedflyten for et spill er:

1. ruten laster og validerer et `Game`-objekt
2. `GameFlow` velger riktig preplay-steg
3. `GameClient` kjører kortstokken i fullscreen-shell
4. enkel spillerstatistikk kan senere vises i `/oppsummering`

`GameFlow` støtter disse stegene:

- `consent`
- `mode_select`
- `instruction`
- `lobby`
- `playing`

Praktisk logikk i dagens repo:

- spill med `warning` starter på samtykkeskjerm
- `spin-the-bottle` uten preset `spinMode` starter med modusvalg
- `physical-item` starter på instruksjonsskjerm
- `custom` kan bruke egen lobby
- ellers går spillet rett til `playing`

Hvis spillerkravet ikke er oppfylt, stopper flyten og viser `GameRequiresPlayersScreen`.

## Spilltyper

`Game.gameType` støtter:

- `default`
- `spin-the-bottle`
- `physical-item`
- `versus`

Praktisk bruk i dagens repo:

- de fleste spill bruker `default`
- `Spinn Flasken`-familien bruker `spin-the-bottle`
- `Snusboksen`-familien bruker `physical-item`
- `Lagduell` er eneste reelle `versus`-spill, og er skjult

## Spillmodell

Et spill består av metadata og en liste med spillkort i `items`.

Viktige toppfelter:

- `id`
- `title`
- `description`
- `items`
- `shuffle`
- `requiresPlayers`
- `minPlayers`
- `intensity`
- `audience`
- `category`

Valgfrie felt brukes for spesialflyt og katalogstyring:

- `warning`
- `gameType`
- `spinMode`
- `teams`
- `tags`
- `custom`
- `hidden`
- `isHiddenFromMain`
- `region`
- `kommune`
- `instagram`

## Spillkort

Hvert spillkort følger `GameTask`.

Obligatoriske felt:

- `type`
- `text`

Valgfrie felt:

- `rule`
- `moment`
- `timer`
- `sipAmount`
- `penalty`

## Korttyper

Systemet støtter disse korttypene:

- `challenge`
- `never_have_i_ever`
- `prompt`
- `pointing`
- `versus`
- `truth_or_shot`

Korttypen påvirker:

- hvilken badge og tone kortet får
- hvordan tekst presenteres i `TaskCard`
- om navn skal skjules
- hva som faktisk spores i oppsummeringen

## Placeholders og spillerutvelgelse

Motoren støtter disse placeholderne i `text` og `rule`:

- `{player}`
- `{player2}`
- `{team1}`
- `{team2}`
- `{all}`

Hvordan de fungerer i praksis:

- `GameClient` velger tilfeldige spillere når kortet bruker `{player}` eller `{player2}`
- utvelgelsen er vektet, ikke helt blind tilfeldig, for å spre spotlighten bedre
- tidligere valgte spillere får lavere sannsynlighet i en periode
- samme kort beholder samme tildeling hvis man går tilbake
- lagplassholdere brukes bare i `versus`

### Navneskjuling

To korttyper skjuler navn med vilje:

- `pointing`
- `never_have_i_ever`

I disse typene blir plassholderne generiske:

- `{player}` -> `Noen`
- `{player2}` -> `En annen`

Det er viktig som innholdsregel at forfattere normalt ikke skal skrive råkort rundt ord som `noen`. Bruk riktig korttype og la motoren håndtere anonymisering når det trengs.

## Spillerkrav

Spillerkrav håndteres i `src/lib/player-requirements.ts`.

Reglene er:

1. `minPlayers` vinner hvis den finnes
2. `spin-the-bottle` og `physical-item` krever minst 2
3. `requiresPlayers: true` krever minst 2
4. ellers kan spillet åpnes uten ferdig spillerliste

## Regelkort

`rule` støtter:

- `action: "activate" | "clear"`
- `title`
- `description`
- `duration`
- `category`
- `replacesCategories`

Runtime-realitet i dagens produkt:

- regelkortets hovedtekst vises som vanlig korttekst
- strukturert `rule`-metadata rendres ikke som egen vedvarende UI i immersive gameplay
- gruppa forventes fortsatt å huske regelen sosialt
- aktive regler spores ikke i standard gameplay-flyt
- `ActiveRulesPanel.tsx` og `src/lib/game-rules.ts` finnes som scaffolding, men er ikke koblet inn i `GameClient`

Det betyr at running rules er en ekte del av innholdet, men ikke et fullt aktivt regelpanel i live gameplay.

## Timere, straff og nivåfelter

`timer`, `penalty` og `sipAmount` må forstås forskjellig:

### `timer`

`timer` er live i gameplay.

I praksis betyr det:

- kort med `timer` får en faktisk nedtelling
- timeren kan startes og restartes
- fullscreen-overlay tar over mens timeren går
- tap-to-advance er blokkert mens timeren kjører

### `penalty`

`penalty` er definert i typer, schema og editor, men er ikke koblet inn i dagens immersive gameplay-shell via `GameClient`.

Det betyr:

- feltet er gyldig data
- men brukeren ser det ikke automatisk i den live fullscreen-opplevelsen

### `sipAmount`

`sipAmount` er også definert i typer, schema og editor, og brukes dessuten på artikkel-/metadata-siden for klassiske drikkeleker.

I aktivt deck-gameplay er det likevel viktig å vite:

- `sipAmount` skaleres ikke inn i live immersive kortvisning i dag
- feltet finnes i modellen, men er ikke en ferdig brukeropplevd gameplay-feature

## Drikkenivå og preferanser

Intensitet finnes på to forskjellige nivåer i repoet:

### Katalogintensitet

`Game.intensity` brukes aktivt i bibliotek og kortlister:

- `low`
- `medium`
- `high`

Dette er live metadata.

### Drikkenivå-preferanse

Repoet har også scaffolding for brukerens drikkenivå:

- `useGameplayPreferences`
- `GameStartDialog`
- `scaleSipAmount`
- menytyper for å endre drikkenivå

Men i dagens faktiske flyt:

- `useGameStart` sender brukeren rett til spillsiden
- `GameStartDialog` åpnes ikke i vanlig bruk
- drikkenivå er ikke koblet inn i live immersive gameplay

Dette er en viktig forskjell mellom “finnes i kodebasen” og “er live i produktet”.

## Moment metadata

`moment` brukes fortsatt i data, men er bare delvis synlig i dagens runtime.

Støttede verdier:

- `impact`
- `chaos`
- `secret`
- `group`

Praktisk effekt i dagens spillopplevelse:

- `secret` påvirker tone og presentasjon
- `chaos` påvirker tone og presentasjon
- `impact` og `group` er i stor grad redaksjonell metadata akkurat nå

Det finnes en egen `ImpactMomentReveal`-komponent og moment-logikk, men reveal-steget er ikke koblet inn i standard gameplay-flyt.

## Gameplay shell

Når `GameFlow` går til aktiv spilling:

- body får klassen `gameplay-active`
- vanlige sideelementer merket med `data-hide-during-gameplay` skjules
- `GameClient` rendrer en fixed fullscreen-shell på `100svh` / full bredde
- scenen kan normalt trykkes direkte for neste kort

Dette betyr i praksis:

- footer skjules
- relaterte lenker og annonser på spillsiden skjules visuelt mens man spiller
- gameplay føles som en egen modus, ikke bare et kort inne på en vanlig side

## Oppsummering og statistikk

Spillerstatistikk lagres lokalt og brukes på `/oppsummering`.

Det som spores i dag:

- `timesTargeted` for navngitte kort med faktiske spillerplassholdere
- `tasksCompleted` for navngitte `challenge`, `prompt` og `truth_or_shot`

Det som ikke spores like rikt:

- `pointing`
- `never_have_i_ever`
- `spin-the-bottle`
- `physical-item`
- `versus`
- `penalties` som faktisk gjennomført straff

Oppsummeringen er derfor en sosial bonus, ikke en full sannhetsmotor.

## Viktige kodefiler

- `src/app/spill/[gameId]/page.tsx`
- `src/components/game/GameFlow.tsx`
- `src/components/game/GameClient.tsx`
- `src/components/game/GameRequiresPlayersScreen.tsx`
- `src/components/game/TaskCard.tsx`
- `src/lib/games.ts`
- `src/lib/gameplay.ts`
- `src/lib/game-editor.ts`
- `src/lib/player-requirements.ts`
- `src/hooks/usePlayers.ts`
- `src/hooks/useGameplayPreferences.ts`
