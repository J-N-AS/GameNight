# Game Library Optimization

Oppdatert: 10. mars 2026

## Kort oppsummert

Denne runden strammet inn GameNight som spillprodukt uten å endre den statisk-first arkitekturen, SEO-strukturen eller én-enhets-premisset. Målet var å gjøre katalogen skarpere, løfte noen svake eller tynne spill, og gi running rules en faktisk plass i opplevelsen.

De viktigste grepene var:

- tydeligere kjernebibliotek i kode og UI
- skjuling av de svakeste eller mest overlappende spillene fra hovedbiblioteket
- målrettede innholdsforbedringer i et mindre sett viktige deck
- enkel motorstøtte for aktive regler i spillsessionen
- kontrollert oppdatering av themes slik at sider og interne lenker fortsatt gir mening

## Tiering

### Tier 1 – Core / flagship

Dette er spillene som nå fungerer som kjernebibliotek og som prioriteres i sortering og hovedvisning:

- `party-klassikere`
- `pekefest`
- `vorspiel-mix`
- `icebreakeren`
- `jeg-har-aldri`
- `pest-eller-kolera`
- `kaosrunden`
- `snusboksen`
- `spinn-flasken`

Praktisk effekt i produktet:

- `/alle-spill` viser et eget `Kjernebibliotek`
- spilllisten sorteres med tier 1 først
- forsiden henter anbefalte spill fra en kuratert liste, ikke bare generell katalogbredde

### Tier 2 – Temaspill / nisje

Dette er spill som fortsatt er gode nok til å beholdes synlige, men som er mer kontekst- eller målgruppestyrte:

- `afterparty`
- `after-dark`
- `bursdags-roast`
- `fadderkampen`
- `girl-power`
- `gutta`
- `hemmeligheter`
- `hyttekos-afterski`
- `julebord`
- `rolig-sosial`
- `sannhet-eller-shot`
- `sexy-dares`
- `sexy-vibes`
- `singles-night`
- `spinn-flasken-action`
- `spinn-flasken-sannhet`
- `snusboksen-sannhet`
- `snusboksen-utfordring`

### Tier 3 – Skjul / slå sammen / vurder fjernet

Disse spillene er nå enten skjult fra hovedbiblioteket eller holdes ute som allerede skjulte dubletter/testspill:

- `datingfail`
- `fyllevalg`
- `hemmelig-bonus`
- `kjapp-party-runde`
- `sexy-action`
- `singles-body`
- `girls-vs-boys`
- `spinn-flasken-ekte`
- `spinn-flasken-virtuell`
- `rt-2025-dummy`

Hvorfor:

- `datingfail` og `fyllevalg` hadde for mye template-rytme og for svak egenidentitet
- `hemmelig-bonus` var ikke faktisk hemmelig nok til å være et bonusspill
- `kjapp-party-runde` ga lite som ikke sterkere partydecks allerede gjør bedre
- `sexy-action` og `singles-body` overlappet for hardt med `singles-night`, `sexy-vibes` og `sexy-dares`
- `spinn-flasken-ekte` og `spinn-flasken-virtuell` er rene preset-varianter av hovedspillet
- `girls-vs-boys` og `rt-2025-dummy` var allerede svake kandidater for offentlig synlighet

## Endringer i spillinnhold

Disse spillene fikk faktisk innholdsarbeid i denne runden:

- `party-klassikere`
  - tydeligere beskrivelse
  - regelkort fikk eksplisitt semantikk for navn, tommel, buddy, husregel og reset
- `vorspiel-mix`
  - beskrivelsen ble spisset som startpakke
  - regelkort for buddy, husregel, tommel, forbudt ord, navnefelle og reset fikk motorstøtte
- `kaosrunden`
  - tydeligere identitet som kontrollert kaosdeck
  - regelkort for kaosregel, navnekaos, tommelpanikk, buddy, forbudt ord og reset fikk støtte
  - ett semantisk dårlig kort ble omskrevet til å velge to andre spillere, ikke blande aktiv spiller inn i valget
- `julebord`
  - beskrivelsen ble mer tro mot faktisk bruksscenario
  - juleforbud, nissemester, nissevenner og regelpause ble gjort motor-klare
- `fadderkampen`
  - decket ble utvidet fra 12 til 20 kort
  - svak Vipps-/pengestraff ble fjernet
  - student- og campusstemmen ble tydeligere
  - campusregel fikk running-rule støtte
- `hyttekos-afterski`
  - beskrivelsen ble strammet inn
  - noen generiske kort ble gjort mer hyttespesifikke
  - hytteregel fikk running-rule støtte
- `sannhet-eller-shot`
  - fikk egen korttype `truth_or_shot` i stedet for å late som kortene er vanlige utfordringer
  - beskrivelsen og spørsmålene ble strammet opp for raskere høytlesning

## Themes, sider og SEO

Det ble gjort kontrollert opprydding i theme-koblinger i stedet for å la svake spill bli stående som fyll:

- `singelkveld`
  - `singles-body` ble byttet ut med `sexy-vibes`
- `kaos-og-konkurranse`
  - `fyllevalg` ble byttet ut med `snusboksen`
- `guttakveld`
  - `fyllevalg` ble byttet ut med `snusboksen`

Bevisste avgrensninger:

- skjulte spill ble i hovedsak flyttet ut av hovedbiblioteket med `isHiddenFromMain`, ikke slettet
- dynamiske spillsider eksisterer fortsatt, slik at gamle lenker og intern struktur ikke brytes unødvendig
- themes, drikkelek-artikler, trust-sider og publisher-grunnmur ble ikke bygget om
- `noindex`-atferden for skjulte spill beholdes via eksisterende spillside-metadata

## Running Rules

Running rules ble løst som en kombinasjon av redaksjonell semantikk og liten klientlogikk:

- `GameTask` støtter nå valgfri `rule`
- støttede handlinger:
  - `activate`
  - `clear`
- aktive regler vises i spillsessionen som en diskret, mobilvennlig liste
- brukeren kan:
  - se aktive regler
  - pause alle regler
  - pause/fortsette enkeltregler
  - oppheve enkeltregler manuelt
- regler med samme kategori erstatter hverandre automatisk
- regler med fast varighet teller ned per neste kort/runde i decket

Dette er bevisst ikke en tung regelmotor:

- ingen backend
- ingen historikkmodell
- ingen egen state machine
- ingen automatisk håndheving utover visning, varighet og enkel erstatning/oppheving

## Videre forbedringer

Dette bør vurderes i neste produkt-/gameplay-runde:

- gjøre flere gode niche-spill like tydelige som `fadderkampen` ble i denne runden
- rydde videre i 18+-klyngen, særlig forholdet mellom `sexy-dares`, `sexy-vibes` og `singles-night`
- vurdere om enkelte skjulte spill skal omskrives helt eller avpubliseres senere
- utvide rulesemantikken til flere relevante deck, men bare der teksten faktisk fortjener det
- eventuelt gi shared-screen/desktop en litt sterkere regelvisning når gruppen spiller på TV
