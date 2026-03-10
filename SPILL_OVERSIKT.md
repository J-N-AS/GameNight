# Spilloversikt

Dette dokumentet er en praktisk oversikt over spillbiblioteket i GameNight. Kildesannhet for hvilke spill som faktisk finnes i appen er:

- `src/lib/games.ts` for hvilke spill-ID-er som lastes
- `src/lib/game-library.ts` for kjernevalg og tiering
- `src/data/*.json` for selve spillkortene

`hidden` betyr at spillet er skjult fra vanlige innganger. `isHiddenFromMain` betyr at spillet ikke vises i hovedbiblioteket, men fortsatt kan finnes via direkte lenke eller spesialflater.

## Kjernebibliotek

Dette er spillene som prioriteres i biblioteket og i produktets anbefalinger.

| Spill | Kort | Profil |
| --- | ---: | --- |
| Party Klassikere | 50 | Bred party-pakke med flere running rules og god startenergi |
| Pekefest | 50 | Ren pekelek og et av de enkleste spillene å lese høyt |
| Vorspiel Mix | 95 | Største allround-deck for vors og sosial oppvarming |
| Icebreakeren | 29 | Trygg bli-kjent-pakke med lav terskel |
| Jeg har aldri | 50 | Klassisk bekjennelsesspill |
| Pest eller Kolera | 25 | Rene dilemma-kort uten ekstra systemlogikk |
| Kaosrunden | 60 | Høyere tempo, flere impact moments og running rules |
| Snusboksen | 29 | Fysisk spill med kast/objekt-flyt |
| Spinn Flasken | 30 | Hovedvarianten for spin-the-bottle-familien |

## Synlige temaspill og nisjer

Dette er offentlige spill som fortsatt vises i bibliotek, temaer eller egne huber.

| Spill | Kort | Profil |
| --- | ---: | --- |
| After Dark – One Last Game | 40 | Senkveldsspill med mer intens tone |
| Afterparty | 59 | Roligere, mer refleksjonsdrevet etterfest |
| Bursdags-Roast | 25 | Nispill for bursdager |
| Fadderkampen | 20 | Fadderuke-spill med campuspreg og enkel running rule |
| Girl Power – Jenta Stemning | 50 | Jentekveld / self-confidence / intern humor |
| Gutta Stemning – Bros & Banter | 55 | Guttakveld med konkurranse og intern humor |
| Hemmeligheter | 55 | Ærlighet og deling med mer voksen tone |
| Hyttekos & Afterski | 29 | Hyttetur og afterski-stemning |
| Julebordet | 20 | Sesongspill med julepreg og flere regelkort |
| Rolig & Sosialt | 40 | Samtale- og bli-kjent-spill uten mye press |
| Sannhet eller Shot | 27 | `truth_or_shot`-kort med ærlig svar eller avtalt straff |
| Sexy Dares – Late Night | 55 | 18+ utfordringer for åpne grupper |
| Sexy Vibes | 55 | Flørtende mellomnivå mellom samtale og utfordring |
| Singles Night – Flørt & Kjemi | 60 | Flørt og sosial kjemi for single grupper |
| Snusboksen: Hvem er...? | 25 | Fysisk variant med identitets- og pekepreg |
| Snusboksen: Hvem tør? | 25 | Fysisk variant med mer utfordringspreg |
| Spinn Flasken: Kun Action | 25 | Spin-variant med bare action-kort |
| Spinn Flasken: Kun Sannhet | 19 | Spin-variant med bare spørsmål |

## Skjult fra hovedbiblioteket

Disse spillene finnes fortsatt i repoet, men er ikke ment som hovedinnganger i dagens produkt.

| Spill | Kort | Status i appen |
| --- | ---: | --- |
| Dating Fails | 52 | `isHiddenFromMain`; tilgjengelig via direkte lenke |
| Dårlige Avgjørelser | 52 | `isHiddenFromMain`; tilgjengelig via direkte lenke |
| Hemmelig Bonus-spill | 21 | `hidden` og `isHiddenFromMain`; bonus/eksperimentell |
| Kjapp Party-runde | 23 | `isHiddenFromMain`; ikke del av hovedbiblioteket |
| Sexy Action – No Limits | 55 | `isHiddenFromMain`; holdes ute fra hovedflaten |
| Singles: Body Language | 50 | `isHiddenFromMain`; overlappende nisjespill |

## Skjulte legacy- og preset-varianter

Disse rutene eksisterer fortsatt, men de er skjult og fungerer mest som legacy-støtte eller preset-varianter.

| Spill | Kort | Status i appen |
| --- | ---: | --- |
| Girls vs Boys ⚔️ | 25 | `hidden`; eneste `versus`-spill i repoet |
| RT 2025: Dummy Bussen | 6 | `hidden` og `isHiddenFromMain`; legacy/custom testspill |
| Spinn Flasken (Ekte Flaske) | 30 | `hidden`; preset `spinMode: "physical"` |
| Spinn Flasken (Virtuell) | 30 | `hidden`; preset `spinMode: "virtual"` |

## Spillfamilier og systemstøtte

- `Spinn Flasken`-familien bruker `gameType: "spin-the-bottle"`
- `Snusboksen`-familien bruker `gameType: "physical-item"`
- `Girls vs Boys` bruker `gameType: "versus"`
- `Sannhet eller Shot` bruker egen korttype: `truth_or_shot`
- Running rules brukes bare i utvalgte deck, ikke i hele biblioteket

## Når biblioteket endres

Oppdater minst disse stedene:

1. `src/data/<spill-id>.json`
2. `src/lib/games.ts`
3. `src/lib/game-library.ts` hvis tiering eller anbefalinger endres
4. `src/data/themes.json` hvis spillet skal inn i temasider
5. `SPILL_OVERSIKT.md`
