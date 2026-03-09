# GameNight – Quality and Bug Audit

Dato: 9. mars 2026  
Repo: `/Users/naleyjanhelge/DEV/GameNight`

## Executive summary
GameNight har et bedre fundament enn innholdskatalogen tilsier ved første blikk. Selve appen bygger og spiller flyter i hovedsak greit, men kvaliteten er ujevn fordi spillmotoren er enklere enn flere av spillene later som, og fordi katalogen inneholder for mange varianter som overlapper eller ikke er kuratert hardt nok.

Kort status:
- Det finnes ingen kritisk totalstopp-bug i hovedflyten, men det finnes flere reelle gameplay-problemer som gjør at spill kan starte i feil kontekst eller gi misvisende opplevelse.
- Den største motorfeilen er at systemet bare skiller mellom `0 spillere` og `minst 1 spiller`. Mange spill trenger egentlig 2, 3 eller lagfordeling, men modellen har ikke felt eller guard for det.
- Statistikken og oppsummeringen ser bra ut, men er bare delvis sann. Flere spilltyper teller ikke i det hele tatt, og `tasksCompleted` betyr i praksis at et navngitt kort ble vist og hoppet videre fra.
- De sterkeste spillene er de enkleste og mest ærlige: `Pekefest`, `Jeg har aldri`, `Pest eller Kolera`, `Party Klassikere`, `Icebreakeren` og `Vorspiel Mix`.
- De svakeste spillene er de som enten er duplikater, feilmodellert eller for tynne til å forsvare plassen: `rt-2025-dummy`, `Girls vs Boys`, `spinn-flasken-ekte`, `spinn-flasken-virtuell`, `datingfail`, `fyllevalg`, `sexy-action`.
- Produktretningen bør nå være tydelig kuratering: færre spill, klarere identitet per spill, og eksplisitte motorbegrensninger i stedet for å late som alt passer i samme modell.

Omfang for denne runden:
- Gjennomgang av spillmotor, flow-komponenter og spillkatalog.
- Gjennomgang av alle 37 spill i `src/data` som brukes via `src/lib/games.ts`.
- Verifisering via `npm run build`.
- Verifisering av `npm run typecheck`: feilet først på stale `.next/types`, passerte etter ny build.

## Viktigste bugs og logiske problemer

| Prioritet | Problem | Hvor | Konsekvens | Vurdering |
| --- | --- | --- | --- | --- |
| Høy | Ingen modell for minimum antall spillere | [`src/lib/types.ts:26`](/Users/naleyjanhelge/DEV/GameNight/src/lib/types.ts:26), [`src/components/game/GameFlow.tsx:78`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameFlow.tsx:78), [`src/components/game/GameClient.tsx:109`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:109) | Spill som trenger flere personer kan kjøres med bare én spiller. `{player2}` blir da i praksis en tom rolle og vises som `En annen`. | Reell gameplay-bug og modellsvakhet. |
| Høy | Stats/oppsummering samsvarer ikke med faktisk gameplay | [`src/components/game/GameClient.tsx:131`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:131), [`src/components/session/OppsummeringClient.tsx:83`](/Users/naleyjanhelge/DEV/GameNight/src/components/session/OppsummeringClient.tsx:83), [`src/lib/types.ts:3`](/Users/naleyjanhelge/DEV/GameNight/src/lib/types.ts:3) | `tasksCompleted` økes når brukeren går videre fra et navngitt kort, ikke når oppgaven faktisk gjøres. `versus`, `pointing`, `spin-the-bottle` og `physical-item` teller ikke. `penalties` finnes, men brukes aldri. | Reell logisk inkonsistens. |
| Høy | `Girls vs Boys` krever laglogikk som ikke finnes | [`src/data/girls-vs-boys.json:13`](/Users/naleyjanhelge/DEV/GameNight/src/data/girls-vs-boys.json:13), [`src/data/girls-vs-boys.json:36`](/Users/naleyjanhelge/DEV/GameNight/src/data/girls-vs-boys.json:36), [`src/components/game/GameClient.tsx:209`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:209) | Spillet har faste lagnavn og poeng, men ingen faktisk lagmedlemskap, ingen balansering og ingen måte å representere kort som ber lagene bytte spillere. | Motor mismatch. Bør ikke regnes som produksjonsklart. |
| Høy | `rt-2025-dummy` eksponeres i 2026-russeside | [`src/app/russetiden/page.tsx:13`](/Users/naleyjanhelge/DEV/GameNight/src/app/russetiden/page.tsx:13), [`src/app/russetiden/page.tsx:29`](/Users/naleyjanhelge/DEV/GameNight/src/app/russetiden/page.tsx:29), [`src/data/rt-2025-dummy.json:2`](/Users/naleyjanhelge/DEV/GameNight/src/data/rt-2025-dummy.json:2) | En dummy med 2025-branding og bare 6 kort blir promotert som eksklusivt gruppespill på en side som ellers snakker om russetid 2026. | Klart produkt- og innholdshull. |
| Middels | Inkonsekvent spilleroppsett-flow på tema-/hub-sider | [`src/components/themes/ThemePageClient.tsx:23`](/Users/naleyjanhelge/DEV/GameNight/src/components/themes/ThemePageClient.tsx:23), [`src/components/fadderuka/FadderukaClient.tsx:55`](/Users/naleyjanhelge/DEV/GameNight/src/components/fadderuka/FadderukaClient.tsx:55), [`src/components/game/RussetidenClient.tsx:164`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/RussetidenClient.tsx:164), sammenlign med [`src/components/game/AllGamesClient.tsx:57`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/AllGamesClient.tsx:57) | `/alle-spill` sender brukeren til spilleroppsett og tilbake. Temaer, Fadderuka og Russetiden viser bare toast og stopper. | Reell UX-inkonsistens. |
| Middels | `Sannhet eller Shot` er modellert som ren `challenge` | [`src/data/sannhet-eller-shot.json:23`](/Users/naleyjanhelge/DEV/GameNight/src/data/sannhet-eller-shot.json:23), [`src/components/game/TaskCard.tsx:27`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/TaskCard.tsx:27) | Kortene presenteres som `Utfordring / Action`, selv om mesteparten er spørsmål med valgfri straff. UI-signalet er feil. | Innholdsmodell passer ikke spilltypen. |
| Middels | `npm run typecheck` er avhengig av en frisk `.next`-mappe | [`tsconfig.json:25`](/Users/naleyjanhelge/DEV/GameNight/tsconfig.json:25) | Typecheck kan feile på en ren eller stale checkout før build har generert riktige `.next/types`. | Verifiserbar utviklerfriksjon. |
| Lav | PWA/offline er bare delvis reell | [`public/sw.js:2`](/Users/naleyjanhelge/DEV/GameNight/public/sw.js:2) | App shell caches, men det finnes ingen tydelig garanti for full offline-spilling av ruter og innhold før de er besøkt. | Ikke akutt, men PWA-løftet er sterkere enn leveransen. |

### Konkret utdyping av de viktigste feilene

### 1. Minimum antall spillere finnes ikke i datamodellen
`Game` har `requiresPlayers?: boolean`, men ikke `minPlayers` eller lignende. Resultatet er at hele systemet bare beskytter mot `0 spillere`, ikke mot for få spillere for det aktuelle spillet. [`src/lib/types.ts:26`](/Users/naleyjanhelge/DEV/GameNight/src/lib/types.ts:26)

Guard-en i `GameFlow` er derfor for svak:
- `if (isLoaded && game.requiresPlayers && players.length === 0)` [`src/components/game/GameFlow.tsx:78`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameFlow.tsx:78)

Når et kort bruker `{player2}`, trekker `GameClient` først `player1` og prøver deretter å hente `player2` fra resten av listen. Hvis listen bare har én spiller, blir `player2` `null`, og UI faller tilbake til `En annen`. [`src/components/game/GameClient.tsx:109`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:109), [`src/components/game/GameClient.tsx:232`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:232)

Konkrete spill som lider av dette:
- `datingfail`: mange kort starter direkte på `{player2}`. [`src/data/datingfail.json:22`](/Users/naleyjanhelge/DEV/GameNight/src/data/datingfail.json:22)
- `fyllevalg`: samme mønster. [`src/data/fyllevalg.json:22`](/Users/naleyjanhelge/DEV/GameNight/src/data/fyllevalg.json:22)
- `hemmelig-bonus`: flere paroppgaver. [`src/data/hemmelig-bonus.json:17`](/Users/naleyjanhelge/DEV/GameNight/src/data/hemmelig-bonus.json:17)
- Hele `spinn-flasken`-familien og `snusboksen`-familien er sosialt meningsløse alene, men kan fortsatt startes uten spillerliste fordi `requiresPlayers` er `false` på spin-variantene. [`src/data/spinn-flasken.json:7`](/Users/naleyjanhelge/DEV/GameNight/src/data/spinn-flasken.json:7)

Vurdering: Dette er den viktigste gameplay-svakheten i repoet fordi den påvirker mange spill samtidig.

### 2. Statsene ser bedre ut enn de er
Oppsummeringen deler ut priser basert på `tasksCompleted` og `timesTargeted`. [`src/components/session/OppsummeringClient.tsx:101`](/Users/naleyjanhelge/DEV/GameNight/src/components/session/OppsummeringClient.tsx:101)

Men `commitStatsForCurrentTask()` hopper helt over:
- `spin-the-bottle`
- `physical-item`
- `versus`
- `pointing`
- `never_have_i_ever`

Se guardene i [`src/components/game/GameClient.tsx:136`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:136) og [`src/components/game/GameClient.tsx:140`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:140).

I tillegg økes `tasksCompleted` så snart man går videre fra et navngitt `challenge`- eller `prompt`-kort. Det finnes ingen registrering av om spilleren faktisk utførte oppgaven eller svarte. [`src/components/game/GameClient.tsx:162`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:162)

Ekstra inkonsistens:
- `penalties` finnes i typen og i persistence-laget, men oppdateres aldri noe sted. [`src/lib/types.ts:3`](/Users/naleyjanhelge/DEV/GameNight/src/lib/types.ts:3), [`src/app/providers.tsx:41`](/Users/naleyjanhelge/DEV/GameNight/src/app/providers.tsx:41)

Konsekvens:
- Oppsummeringen fungerer best for klassiske navngitte prompt/challenge-spill.
- Den er svak eller meningsløs etter `Pekefest`, `Jeg har aldri`, `Spinn Flasken`, `Snusboksen`, `Girls vs Boys` og flere andre.

Vurdering: Ikke en krasj-bug, men et ekte kvalitetsproblem for et produkt som vil bruke stats som payoff.

### 3. `Girls vs Boys` later som det finnes lagstate
Spillet definerer lagnavn og bruker `gameType: versus`. [`src/data/girls-vs-boys.json:13`](/Users/naleyjanhelge/DEV/GameNight/src/data/girls-vs-boys.json:13)

Motoren kan bare gjøre to ting i versus:
- vise `team1/team2`
- telle poeng på knappetrykk [`src/components/game/GameClient.tsx:209`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:209)

Det finnes derimot ingen faktisk lagmodell med medlemmer, ingen sjekk for at gruppa faktisk består av jenter og gutter, og ingen måte å representere kort som:
- `Lagene må bytte én spiller for de neste to rundene.` [`src/data/girls-vs-boys.json:36`](/Users/naleyjanhelge/DEV/GameNight/src/data/girls-vs-boys.json:36)

I praksis blir spillet mer en dekorativ poengteller enn et robust lagspill. Det gjør også opplevelsen unødvendig rigid og binær.

Vurdering: Bør enten få en egen lagmodell eller skjules/fjernes.

### 4. Spilleroppsett-flow er inkonsekvent mellom sider
`/alle-spill` gjør riktig ting: stopper klikk, viser toast og sender brukeren til spilleroppsett med `returnTo`. [`src/components/game/AllGamesClient.tsx:57`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/AllGamesClient.tsx:57)

Flere andre innganger gjør mindre:
- Tema-sider stopper bare klikk og viser toast. [`src/components/themes/ThemePageClient.tsx:23`](/Users/naleyjanhelge/DEV/GameNight/src/components/themes/ThemePageClient.tsx:23)
- Fadderuka gjør det samme. [`src/components/fadderuka/FadderukaClient.tsx:55`](/Users/naleyjanhelge/DEV/GameNight/src/components/fadderuka/FadderukaClient.tsx:55)
- Russetiden gjør det samme for både standard- og custom-spill. [`src/components/game/RussetidenClient.tsx:164`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/RussetidenClient.tsx:164), [`src/components/game/RussetidenClient.tsx:219`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/RussetidenClient.tsx:219)

Konsekvens:
- Samme produkt gir ulik hjelp avhengig av hvor spillkortet ble klikket.
- Dette er særlig dårlig på mobil, der et stopp-toast ofte bare føles som et brutt klikk.

### 5. `rt-2025-dummy` og andre kataloginkonsistenser er synlige
Russetid-siden profileres som 2026. [`src/app/russetiden/page.tsx:13`](/Users/naleyjanhelge/DEV/GameNight/src/app/russetiden/page.tsx:13)

Samtidig henter siden alle `isHiddenFromMain`-spill som `customGames`. [`src/app/russetiden/page.tsx:29`](/Users/naleyjanhelge/DEV/GameNight/src/app/russetiden/page.tsx:29)

`rt-2025-dummy` er nettopp et slikt spill, med tittel `RT 2025: Dummy Bussen` og bare seks kort. [`src/data/rt-2025-dummy.json:2`](/Users/naleyjanhelge/DEV/GameNight/src/data/rt-2025-dummy.json:2)

Det gjør at en åpenbar test/dummy blir en del av offentlig produktflate.

Beslektet katalogproblem:
- `Hemmelig Bonus-spill` er markedsført som hemmelig, men er ikke skjult i metadata i det hele tatt. [`src/data/hemmelig-bonus.json:2`](/Users/naleyjanhelge/DEV/GameNight/src/data/hemmelig-bonus.json:2)

## Spillmotor vs innholdsmodell
Den viktigste observasjonen i denne runden er at flere “dårlige spill” egentlig er blandinger av tre forskjellige problemer:
- innholdet er svakt
- motoren mangler semantikk
- UX-en presenterer samme korttype for oppgaver som egentlig er forskjellige

### Der motoren fungerer godt
Dagens modell fungerer best for spill som er:
- rene pekeleker
- rene `Jeg har aldri`-kort
- rene dilemma-/samtalespill
- enkle prompt/challenge-spill der ett navn kan settes inn

Det er derfor spill som `Pekefest`, `Jeg har aldri`, `Pest eller Kolera`, `Icebreakeren` og store deler av `Party Klassikere` og `Vorspiel Mix` oppleves sterkest.

### Der motoren er for svak
#### Lagspill
`versus`-modellen kan bare gi poeng til `team1` eller `team2`. Den kan ikke:
- opprette lag fra spillerlisten
- flytte spillere mellom lag
- håndtere ubalanserte grupper
- vite hvem som faktisk tilhører laget

Det gjør `Girls vs Boys` til det tydeligste eksempelet på et spill som ikke passer motoren.

#### To-personers eller relasjonelle kort
Dataene bruker `{player}` og `{player2}`, men systemet vet ikke om et spill bør kreve minst to eller tre spillere. Det vet heller ikke om et kort er:
- “player1 gjør noe mot player2”
- “player2 er bare en responsrolle”
- “to tilfeldige personer må velges, men ingen av dem er aktiv spiller”

Eksempel på modellkollisjon:
- `datingfail` og `fyllevalg` har flere kort som bare starter på `{player2}`. [`src/data/datingfail.json:22`](/Users/naleyjanhelge/DEV/GameNight/src/data/datingfail.json:22), [`src/data/fyllevalg.json:22`](/Users/naleyjanhelge/DEV/GameNight/src/data/fyllevalg.json:22)
- `kaosrunden` har et kort som både bruker `{player}` som aktiv spiller og inne i listen over de to som velges. Det fungerer tekstlig, men er egentlig feil semantikk. [`src/data/kaosrunden.json:51`](/Users/naleyjanhelge/DEV/GameNight/src/data/kaosrunden.json:51)

#### Mixed-mode spørsmål med straff
`Sannhet eller Shot` er hovedsakelig spørsmål med valgfri straff, men dataene må velge mellom `prompt` og `challenge`. De har valgt `challenge`, som gir feil visuell framing. [`src/data/sannhet-eller-shot.json:23`](/Users/naleyjanhelge/DEV/GameNight/src/data/sannhet-eller-shot.json:23)

Dette tyder på behov for en egen type, for eksempel `truth_or_penalty`, eller en modell der kortet har både `question` og `fallbackAction`.

#### Fysiske spill og spin-spill
Disse fungerer som flow, men ikke som stats- eller personmodeller.
- `spin-the-bottle` og `physical-item` hopper helt ut av statssystemet. [`src/components/game/GameClient.tsx:136`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameClient.tsx:136)
- Det er riktig at navn ikke settes inn her, men det betyr også at oppsummeringen blir irrelevant for store deler av katalogen.

### UX-problemer som egentlig er modellproblemer
- Mange `challenge`-kort er egentlig spørsmål med straff, ikke handling.
- Mange `prompt`-kort er egentlig gruppeoppgaver, ikke én persons spørsmål.
- Flere spill med fysisk nærhet eller rolig samtale har samme veksling `prompt -> challenge -> pointing`, noe som skaper mekanisk følelse selv når temaet er ulikt.

## Innholdskvalitet per spill

Statuskategorier brukt her:
- `Behold som det er`
- `Behold, men bør forbedres`
- `Bør gjennomgås grundig`
- `Bør skjules midlertidig`
- `Kandidat for fjerning`

| Spill | Score | Status | Kort vurdering |
| --- | --- | --- | --- |
| After Dark | 8/10 | Behold, men bør forbedres | En av de tydeligste 18+-identitetene. Litt overlapp med `Afterparty`, men sterkere vibe. |
| Afterparty | 7/10 | Behold, men bør forbedres | Varm og brukbar, men for skjematisk og delvis duplisert mot `After Dark`. |
| Bursdags-Roast | 7/10 | Behold, men bør forbedres | God nisje og sosial payoff, men kunne vært mer personlig eller parameterisert. |
| Dating Fails | 4/10 | Bør skjules midlertidig | For mye malverk, for mye `{player2}`-bruk uten ordentlig semantikk, for lite unik stemme. |
| Fadderkampen | 6/10 | Behold, men bør forbedres | Klar målgruppe og bra nisje, men for kort og med et par svake kort, blant annet Vipps-kortet. |
| Dårlige Avgjørelser | 4/10 | Bør skjules midlertidig | For lik `Dating Fails` i struktur og svakere enn tittelen lover. |
| Girl Power | 6/10 | Behold, men bør forbedres | Fungerer, men flere kort er generiske og kunne hatt skarpere identitet. |
| Girls vs Boys | 3/10 | Kandidat for fjerning | Motoren støtter ikke premisset godt nok, og konseptet er rigid og gammeldags. |
| Gutta Stemning | 7/10 | Behold, men bør forbedres | Tydeligere identitet enn `Girl Power`, men fortsatt en del generisk fyll. |
| Hemmelig Bonus-spill | 4/10 | Bør skjules midlertidig | Tittelen lover hemmelighet, metadata gjør det offentlig, og innholdet er en løs bonuspose. |
| Hemmeligheter | 5/10 | Bør gjennomgås grundig | Har potensial, men lider av samme scaffold-problem som `Dating Fails` og `Fyllevalg`. |
| Hyttekos & Afterski | 7/10 | Behold, men bør forbedres | Distinkt og tematro, med bra nisjefølelse. Kunne vært strammere og litt mer minneverdig. |
| Icebreakeren | 8/10 | Behold som det er | En av de beste matchene mellom motor og innhold. Trygg, tydelig og lett å forstå. |
| Jeg har aldri | 8/10 | Behold som det er | Klassikeren gjør akkurat det den skal. Ren, lesbar og lav risiko. |
| Julebordet | 7/10 | Behold, men bør forbedres | Sesongspill med tydelig kontekst. Ikke topptungt, men helt brukbart. |
| Kaosrunden | 7/10 | Behold, men bør forbedres | God energi og tydelig premiss, men noen kort er fyll og ett kort er semantisk feil. |
| Kjapp Party-runde | 5/10 | Bør gjennomgås grundig | Ikke dårlig, men overflødig ved siden av sterkere generelle partyspill. |
| Party Klassikere | 8/10 | Behold som det er | En av de tydeligste basispakkene. Bred, nyttig og lett å anbefale. |
| Pekefest | 9/10 | Behold som det er | Veldig ren idé, lite friksjon, høy gjenbrukbarhet og god motor-match. |
| Pest eller Kolera | 8/10 | Behold som det er | Tydelig format, gode dilemmaer, null modellfriksjon. |
| Rolig & Sosialt | 7/10 | Behold, men bør forbedres | Bra trygg samtalepakke, men overlapper med `Icebreakeren` og kan bli monoton. |
| RT 2025: Dummy Bussen | 1/10 | Kandidat for fjerning | Dummy/testaktig innhold som ikke hører hjemme i offentlig katalog. |
| Sannhet eller Shot | 6/10 | Behold, men bør forbedres | God idé og potensial, men feilmodellert i UI og for lik ren Q&A i praksis. |
| Sexy Action – No Limits | 4/10 | Bør skjules midlertidig | For tung overlap med `Singles: Body Language` og svakere kuratert. |
| Sexy Dares – Late Night | 6/10 | Bør gjennomgås grundig | Noe tydeligere identitet enn `Sexy Action`, men fortsatt mye repetisjon og filler. |
| Sexy Vibes | 7/10 | Behold, men bør forbedres | Den beste av de flørtete mellomintense pakkene. Fortsatt noe overlapp med `Singles Night`. |
| Singles: Body Language | 5/10 | Bør gjennomgås grundig | Tydelig fokus, men for mye tekstlig og mekanisk overlap med `Sexy Action`. |
| Singles Night – Flørt & Kjemi | 7/10 | Behold, men bør forbedres | Den sterkeste av de mer direkte singles-pakkene, men bør trimmes og differensieres tydeligere. |
| Spinn Flasken | 8/10 | Behold, men bør forbedres | Sterk hovedvariant. Trenger spillerkrav og katalogopprydding rundt variantene. |
| Spinn Flasken: Kun Action | 6/10 | Bør gjennomgås grundig | Har et tydelig filter, men ligger farlig nær ren “mer av det samme”-variant. |
| Spinn Flasken: Kun Sannhet | 7/10 | Behold, men bør forbedres | Den mest forsvarlige spin-varianten ved siden av hovedspillet. |
| Spinn Flasken (Ekte Flaske) | 2/10 | Bør skjules midlertidig | 100 % duplikat av hovedspillet, bare med forhåndsvalgt modus. |
| Spinn Flasken (Virtuell) | 2/10 | Bør skjules midlertidig | Samme problem som `Spinn Flasken (Ekte Flaske)`. |
| Snusboksen | 8/10 | Behold, men bør forbedres | Fysisk format som faktisk passer motoren bra. Enkel og gøy. |
| Snusboksen: Hvem tør? | 6/10 | Bør gjennomgås grundig | Fungerer, men identiteten er svakere og ikke alle kort lever opp til tittelen. |
| Snusboksen: Hvem er...? | 7/10 | Behold, men bør forbedres | Bra fysisk sosialvariant. Mindre friksjon enn mange andre nisjespill. |
| Vorspiel Mix | 8/10 | Behold, men bør forbedres | En av katalogens sterkeste brede pakker, men altfor lang og litt for uskarp i kuratering. |

### Spill som er sterke i dag
De sterkeste spillene akkurat nå er de som både har tydelig identitet og passer dagens motor uten spesialtilpasning:
- `Pekefest`
- `Jeg har aldri`
- `Pest eller Kolera`
- `Party Klassikere`
- `Icebreakeren`
- `Vorspiel Mix`
- `Spinn Flasken` som hovedspill
- `Snusboksen`

### Spill som trekker totalopplevelsen mest ned
- `rt-2025-dummy`
- `Girls vs Boys`
- `spinn-flasken-ekte`
- `spinn-flasken-virtuell`
- `datingfail`
- `fyllevalg`
- `sexy-action`
- `hemmelig-bonus`

## Gjentagelser, duplisering og svake mønstre

### 1. Den største dupliseringsklyngen er `Spinn Flasken`
`spinn-flasken`, `spinn-flasken-ekte` og `spinn-flasken-virtuell` har identisk innhold kort for kort. Forskjellen er bare `spinMode`. Se for eksempel første halvdel av alle tre filer:
- [`src/data/spinn-flasken.json:24`](/Users/naleyjanhelge/DEV/GameNight/src/data/spinn-flasken.json:24)
- [`src/data/spinn-flasken-ekte.json:24`](/Users/naleyjanhelge/DEV/GameNight/src/data/spinn-flasken-ekte.json:24)
- [`src/data/spinn-flasken-virtuell.json:24`](/Users/naleyjanhelge/DEV/GameNight/src/data/spinn-flasken-virtuell.json:24)

Dette er ren katalogstøy. Hovedspillet gjør allerede modusvalget i flowen. [`src/components/game/GameFlow.tsx:33`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameFlow.tsx:33)

### 2. `Dating Fails`, `Dårlige Avgjørelser` og `Hemmeligheter` deler samme scaffold
Disse spillene bruker gjentatt mønster som dette:
- `{player}` prompt
- `{player2}` challenge/straff
- pointing-kort
- “drikk hvis ja”-kort

Konkrete eksempler:
- [`src/data/datingfail.json:18`](/Users/naleyjanhelge/DEV/GameNight/src/data/datingfail.json:18)
- [`src/data/fyllevalg.json:18`](/Users/naleyjanhelge/DEV/GameNight/src/data/fyllevalg.json:18)
- [`src/data/hemmeligheter.json:1`](/Users/naleyjanhelge/DEV/GameNight/src/data/hemmeligheter.json:1)

Problemet er ikke bare duplikatord, men at spillene får nesten samme rytme og samme følelsen av “template deck”.

### 3. `Afterparty` og `After Dark` er delvis for nære hverandre
De er ikke identiske, men deler flere tydelige formuleringer og samme rolige rytme. Eksempler:
- `Alle tar én slurk i stillhet.` i `Afterparty` og `After Dark` [`src/data/afterparty.json:113`](/Users/naleyjanhelge/DEV/GameNight/src/data/afterparty.json:113), [`src/data/after-dark.json:27`](/Users/naleyjanhelge/DEV/GameNight/src/data/after-dark.json:27)
- `Hvem her er mest til stede akkurat nå?` i begge. [`src/data/afterparty.json:133`](/Users/naleyjanhelge/DEV/GameNight/src/data/afterparty.json:133), [`src/data/after-dark.json:30`](/Users/naleyjanhelge/DEV/GameNight/src/data/after-dark.json:30)

Konklusjon: Begge kan beholdes, men de må få tydeligere avstand i tone og bruksscenario.

### 4. De mest intense 18+-spillene er overrepresentert og for like
Særlig disse overlapper hardt:
- `Sexy Action`
- `Singles: Body Language`
- `Sexy Dares`
- `Singles Night`

Eksempler på nesten samme byggesteiner:
- nærhet / fang / hånd / kinn / skulder / pannen mot pannen
- samme “alle som liker langsom oppbygging: drikk”-type linjer
- samme pointing-kort om intensitet, stillhet, sjarme og trygghet

Se for eksempel:
- [`src/data/sexy-action.json:45`](/Users/naleyjanhelge/DEV/GameNight/src/data/sexy-action.json:45)
- [`src/data/singles-body.json:35`](/Users/naleyjanhelge/DEV/GameNight/src/data/singles-body.json:35)

Dette er et klassisk tegn på at katalogen trenger hard kuratering, ikke flere varianter.

## Spill som bør beholdes, forbedres, skjules eller fjernes

### Behold som det er
- `Pekefest`
- `Jeg har aldri`
- `Pest eller Kolera`
- `Party Klassikere`
- `Icebreakeren`

### Behold, men bør forbedres
- `After Dark`
- `Afterparty`
- `Bursdags-Roast`
- `Fadderkampen`
- `Girl Power`
- `Gutta Stemning`
- `Hyttekos & Afterski`
- `Julebordet`
- `Kaosrunden`
- `Rolig & Sosialt`
- `Sannhet eller Shot`
- `Sexy Vibes`
- `Singles Night`
- `Spinn Flasken`
- `Spinn Flasken: Kun Sannhet`
- `Snusboksen`
- `Snusboksen: Hvem er...?`
- `Vorspiel Mix`

### Bør gjennomgås grundig
- `Hemmeligheter`
- `Kjapp Party-runde`
- `Sexy Dares`
- `Singles: Body Language`
- `Spinn Flasken: Kun Action`
- `Snusboksen: Hvem tør?`

### Bør skjules midlertidig
- `Dating Fails`
- `Dårlige Avgjørelser`
- `Hemmelig Bonus-spill`
- `Sexy Action – No Limits`
- `Spinn Flasken (Ekte Flaske)`
- `Spinn Flasken (Virtuell)`

### Kandidat for fjerning
- `Girls vs Boys`
- `RT 2025: Dummy Bussen`

## Anbefalt prioritering for neste fase

### 1. Haster mest: gameplay-bugs og logiske hull
1. Innfør `minPlayers` i datamodellen og håndhev det i flowen.
2. Gjør spilleroppsett-flowen lik overalt, med `returnTo` fra temaer, Fadderuka og Russetiden.
3. Bestem om oppsummering skal være ekte telemetry eller et “best effort”-morsomhetslag. Nå later den som den er mer sann enn den er.
4. Fjern eller skjul `rt-2025-dummy` fra offentlig russ-side umiddelbart.
5. Skjul `spinn-flasken-ekte` og `spinn-flasken-virtuell` umiddelbart.

### 2. Viktigste innholdsopprydding
1. Slå hardt ned på template-spillene: `datingfail`, `fyllevalg`, `hemmeligheter`.
2. Velg færre, sterkere 18+-spill i stedet for fire-fem nesten like varianter.
3. Gjør `Sannhet eller Shot` til et spill med riktig kortlogikk i stedet for å tvinge alt inn som `challenge`.
4. Avgjør om `Rolig & Sosialt` og `Icebreakeren` skal være to separate produkter eller tydeligere differensierte søsken.
5. Rydd tematiske nisjespill ved å styrke de som faktisk har tydelig setting: `Fadderkampen`, `Julebordet`, `Hyttekos & Afterski`, `Bursdags-Roast`.

### 3. Spill som har størst potensial hvis de forbedres
- `Sannhet eller Shot`: bra premiss, feil modell.
- `Kaosrunden`: allerede sterk energi, trenger bare smartere og mindre repetitiv kuratering.
- `Afterparty`: kan bli et veldig bra signaturspill hvis det differensieres tydeligere fra `After Dark`.
- `Snusboksen`: fysisk formatet passer produktet godt og kan bli et tydelig GameNight-kjennetegn.
- `Fadderkampen`: god nisje for organisk trafikk og faktisk bruk, men trenger mer innhold.
- `Singles Night`: best av de mer direkte flørtespillene, men trenger tydeligere avstand til de andre spicy-variantene.

## Små, verifiserbare funn
- `penalties` finnes i typer og persistence, men brukes ikke. [`src/lib/types.ts:3`](/Users/naleyjanhelge/DEV/GameNight/src/lib/types.ts:3), [`src/app/providers.tsx:41`](/Users/naleyjanhelge/DEV/GameNight/src/app/providers.tsx:41)
- `PlayerSetup` lar brukeren fortsette med ett hvilket som helst antall spillere over null. [`src/components/game/PlayerSetup.tsx:58`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/PlayerSetup.tsx:58)
- `GameRequiresPlayersScreen` sier bare at spillere må legges til, ikke hvor mange. [`src/components/game/GameRequiresPlayersScreen.tsx:21`](/Users/naleyjanhelge/DEV/GameNight/src/components/game/GameRequiresPlayersScreen.tsx:21)
- `docs/current-state-report.md` er delvis ute av sync med faktisk kode. Den hevder fortsatt at `spinn-flasken-ekte` mangler `gameType`, men filen har `gameType: spin-the-bottle`. [`docs/current-state-report.md:118`](/Users/naleyjanhelge/DEV/GameNight/docs/current-state-report.md:118), [`src/data/spinn-flasken-ekte.json:12`](/Users/naleyjanhelge/DEV/GameNight/src/data/spinn-flasken-ekte.json:12)
- `npm run build` er grønn i nåværende repo. `npm run typecheck` ble først blokkert av `.next/types`-referanser, men passerte etter ny build. [`tsconfig.json:25`](/Users/naleyjanhelge/DEV/GameNight/tsconfig.json:25)

## Konklusjon
GameNight er allerede nær et bra kuratert produkt, men ikke fordi katalogen er jevnt sterk. Det er motsatt: appen tåler en opprydding godt, og vil sannsynligvis bli betydelig bedre av å miste 6–10 svake eller overflødige spill.

Det beste i repoet i dag er:
- en enkel, mobilvennlig kjerneflyt
- flere sterke one-screen-spill som passer formatet godt
- tydelig potensial i fysiske spill og trygge sosialspill

Det svakeste er:
- manglende spillersemantikk
- misvisende oppsummeringslogikk
- for mange katalogvarianter som er duplikater eller halvvarianter
- noen spill som later som de er mer spesielle enn de faktisk er

Hvis neste fase handler om å rydde, forbedre og kuratere hardt, er GameNight i en mye bedre posisjon enn om dere prøver å “legge på enda flere spill”.
