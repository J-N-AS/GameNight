# Running Rules Engine Review

Oppdatert: 10. mars 2026

## Hva som ble implementert

GameNight har nå en liten klientbasert modell for aktive regler under spilling. Dette er ment som støtte for sosial håndheving, ikke som en kompleks motor.

Implementert:

- valgfri `rule` på `GameTask`
- støtte for `activate` og `clear`
- aktiv regel-liste i `GameClient`
- visning av aktive regler i spillsiden
- automatisk nedtelling for regler med fast varighet
- automatisk erstatning når ny regel i samme kategori trekkes
- manuell `pause`, `fortsett` og `opphev` fra UI

## Datamodell

`GameTask` kan nå inneholde:

- `action`
  - `activate` eller `clear`
- `title`
- `description`
- `duration`
  - valgfritt antall runder/kort
- `category`
  - brukes for enkel erstatning i samme familie
- `replacesCategories`
  - valgfri eksplisitt erstatningsliste

Dette brukes per nå i utvalgte deck som faktisk lever på running rules:

- `party-klassikere`
- `vorspiel-mix`
- `kaosrunden`
- `julebord`
- `fadderkampen`
- `hyttekos-afterski`

## Hvordan motoren oppfører seg

Når spilleren går videre fra et kort:

1. eksisterende aktive regler teller ned én runde dersom de ikke er pauset
2. regel knyttet til gjeldende kort aktiveres eller rydder opp
3. den oppdaterte listen vises i spillsiden

Praktiske konsekvenser:

- en regel på `3 runder` betyr de neste tre kortene/rundene i decket
- regler uten `duration` ligger aktive til de blir erstattet eller opphevet
- `clear` uten kategori rydder alle aktive regler

## UI-prinsipper

UI-en er bevisst liten:

- panelet vises bare når det finnes aktive regler
- det er kollapsbart for å unngå støy
- hver regel viser:
  - navn
  - kort forklaring
  - kategori
  - runder igjen eller at den varer til oppheving
- brukeren kan pause/fortsette eller fjerne regler direkte

Dette holder GameNight raskt og mobilvennlig, samtidig som rule-kort ikke forsvinner idet neste kort trekkes.

## Bevisste begrensninger

Denne løsningen gjør ikke følgende:

- sporer ikke hvilke spillere som faktisk bryter regler
- håndhever ikke buddy-par eller spørsmålsmester automatisk
- persisterer ikke regler ved refresh/navigasjon
- bruker ikke backend eller global app-state
- modellerer ikke kompliserte utløpsbetingelser utover varighet og enkel erstatning

## Hvorfor dette er riktig nivå nå

GameNight er fortsatt et statisk-first, én-skjerm-produkt. En tyngre regelmotor ville skapt mer kode, mer UI-støy og mer vedlikehold enn produktet trenger akkurat nå.

Denne runden løser det viktigste hullet:

- regelkort er ikke lenger bare tekst som forsvinner
- gruppa får en enkel huskeliste underveis
- innhold og motor henger bedre sammen i de deckene som faktisk trenger det

## Naturlige neste steg

- støtte flere rule-kategorier dersom flere deck faktisk bruker dem
- vurdere bedre shared-screen-visning for aktive regler
- eventuelt spore noen få sosiale roller eksplisitt senere, hvis det gir reell payoff i oppsummeringen
