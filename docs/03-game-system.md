# Game system

## Oversikt

GameNight bruker et lett gameplay-system som er bygd for én skjerm, korte runder og data-drevne spillkort. Systemet er fleksibelt nok til flere spillfamilier, men fortsatt enkelt nok til at nye spill kan legges til som JSON.

## Spillflyt

Hovedflyten for et spill er:

1. ruten laster et `Game`-objekt
2. `GameFlow` velger oppstartssteg
3. `GameClient` kjører kortstokken
4. lokal spillerstatistikk kan brukes i oppsummeringen

`GameFlow` støtter disse stegene:

- `consent`
- `mode_select`
- `instruction`
- `lobby`
- `playing`

Ikke alle spill bruker alle steg.

## Spilltyper

`Game.gameType` støtter fire moduser:

- `default`
- `spin-the-bottle`
- `physical-item`
- `versus`

Praktisk bruk i dagens repo:

- de fleste spill bruker `default`
- `Spinn Flasken`-familien bruker `spin-the-bottle`
- `Snusboksen`-familien bruker `physical-item`
- `Girls vs Boys` er eneste `versus`-spill, og er skjult

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

## Spillkort

Hvert spillkort følger `GameTask`.

Obligatoriske felt:

- `type`
- `text`

Valgfrie felt:

- `rule`
- `moment`

### Korttyper

Systemet støtter disse korttypene:

- `challenge`
- `never_have_i_ever`
- `prompt`
- `pointing`
- `versus`
- `truth_or_shot`

Korttypen påvirker:

- visuell presentasjon i `TaskCard`
- hint og tone i UI
- hvordan navn skjules eller vises
- hvilke kort som teller i oppsummeringen

## Placeholders

Motoren støtter disse placeholderne i `text` og `rule`-metadata:

- `{player}`
- `{player2}`
- `{team1}`
- `{team2}`
- `{all}`

Hvordan de fungerer:

- `GameClient` velger tilfeldige spillere når kortet bruker `{player}` eller `{player2}`
- `pointing` og `never_have_i_ever` skjuler navn og bruker generiske tekster som `Noen`
- `spin-the-bottle` og `physical-item` bruker normalt ikke navneinnsetting
- lagplassholdere brukes bare i `versus`

## Spillerkrav

Spillerkrav håndteres i `src/lib/player-requirements.ts`.

Reglene er:

1. `minPlayers` vinner hvis den finnes
2. `spin-the-bottle` og `physical-item` krever minst 2
3. `requiresPlayers: true` krever minst 2
4. ellers kan spillet åpnes uten ferdig spillerliste

`useGameStart` og `GameFlow` sender brukeren til spilleroppsett når det mangler nok spillere.

## Regelkort

`rule` støtter:

- `action: "activate" | "clear"`
- `title`
- `description`
- `duration`
- `category`
- `replacesCategories`

Hvordan det virker i praksis nå:

- regeltekst vises i selve kortet
- gruppa forventes å huske regelen sosialt
- gameplay har ikke et aktivt regelpanel i standardflyten
- regler spores ikke utover kortet og persisteres ikke ved refresh

Dette er bevisst. GameNight prioriterer tempo og lav administrasjon foran regel-UI.

## Moment metadata

`moment` brukes fortsatt i data, men ikke lenger som eget reveal-steg i standard gameplay.

Støttede verdier:

- `impact`
- `chaos`
- `secret`
- `group`

I praksis brukes `moment` nå til:

- tone og badge i `TaskCard`
- redaksjonell markering av kort som skal føles større
- eventuell senere differensiering hvis det faktisk trengs

## Gameplay shell

Når `GameFlow` går til `playing`, legges body-klassen `gameplay-active` på.

Det brukes for å skjule elementer merket med `data-hide-during-gameplay`, som:

- global footer
- related-seksjonen på spillsiden

SEO-innholdet blir fortsatt rendret i HTML, men forsvinner visuelt mens man spiller.

## Oppsummering og statistikk

Spillerstatistikk lagres lokalt og brukes på `/oppsummering`.

Det er viktig å forstå begrensningen:

- `timesTargeted` økes for navngitte kort med spillere
- `tasksCompleted` økes for navngitte `challenge`, `prompt` og `truth_or_shot`
- `pointing`, `never_have_i_ever`, `spin-the-bottle`, `physical-item` og `versus` gir ikke like rik statistikk

Oppsummeringen er derfor en sosial bonus, ikke en full sannhetsmotor.

## Viktige kodefiler

- `src/app/spill/[gameId]/page.tsx`
- `src/components/game/GameFlow.tsx`
- `src/components/game/GameClient.tsx`
- `src/components/game/TaskCard.tsx`
- `src/lib/gameplay.ts`
- `src/lib/player-requirements.ts`
