# GameNight Master

Sist oppdatert: 2026-04-04

Dette dokumentet er kildesannhet for GameNight. Målet er at en ny AI eller utvikler skal kunne forstå produktet, arkitekturen, gameplay-flyten, UX-prinsippene og innholdsreglene uten å lese kildekoden først.

Hvis dette dokumentet er i konflikt med eldre dokumentasjon, skal dette dokumentet vinne. Eldre dokumenter bør da oppdateres.

## 1. Hva GameNight egentlig er

GameNight er en norsk, statisk-first festspillplattform for voksne. Produktet er bygget rundt én delt skjerm, ikke én skjerm per spiller. Normal bruk er:

`én mobil eller én nettleser -> hele gruppen ser samme kort -> én person styrer -> alle spiller i samme rom`

Det er ikke et SaaS-produkt, ikke en multiplayer-plattform og ikke et konto-basert system. Hele prosjektet er bevisst laget for å starte raskt, være lett å drifte og fungere uten backend, database eller innlogging.

Den viktigste produktløkken er:

`forside -> velg spill -> legg eventuelt inn spillere -> spill i fullscreen -> oppsummering eller nytt spill`

Ved siden av dette har GameNight et redaksjonelt distribusjonslag med temasider, artikler og huber som skal lede folk inn til selve spillene.

## 2. Produktessens og UX-filosofi

### 2.1 Immersiv fullscreen-følelse

Gameplay skal føles mer som en stories-opplevelse enn som en klassisk webapp med kort, paneler og knapper stablet under hverandre.

Kjennetegn:

- aktiv spilling låser opplevelsen til en fullscreen-shell på `100svh` x `100vw`
- ett kort fyller hele scenen
- store gradients og mørk feststemning erstatter “vanlig side med innhold”
- fremdrift skjer hovedsakelig ved å trykke hvor som helst på scenen
- UI rundt kortet er redusert til et absolutt minimum

Det skal oppleves som:

- raskt
- selvsikkert
- litt teatralsk
- lett å caste til TV
- lett å lese høyt

Dette er ikke et “dashboard”. Dette er et party-verktøy med scene-følelse.

### 2.2 No SaaS / No Friction

GameNight skal i prinsippet ha så lite produktfriksjon som mulig:

- ingen login
- ingen konto
- ingen brukerprofil
- ingen betalt unlock av kjernespill
- ingen databaseavhengighet
- ingen flertrinns onboarding før man forstår produktet
- minst mulig forklarende mikrocopy før første spill kan starte

Det viktigste er at brukeren raskt finner et spill og kommer i gang.

Det finnes likevel én viktig implementasjonsrealitet som fremtidige AI-er må vite om:

- dagens produksjonsoppsett har en annonse-/consent-gate via `AdAccessGate`
- uten samtykke, eller hvis adblock stopper annonser, blokkeres store deler av appen
- dette er den største nåværende UX-friksjonen i produktet
- denne friksjonen er teknisk reell, men den er i spenning med produktets ideal om “minst mulig friksjon”

Når man foreslår forbedringer, bør man derfor skille mellom:

- produktets ønskede filosofi
- dagens faktiske monetiseringsrealisme

### 2.3 Tap-to-Advance som hovedmekanikk

Den viktigste gameplay-regelen i UI-et er:

`neste kort = trykk hvor som helst`

Tradisjonelle “Neste”-knapper er bevisst fjernet fra normal kortflyt. I aktiv fullscreen-gameplay skal selve scenen være knappen.

Unntak:

- `versus`-kort krever eksplisitt valg av vinner
- timerkort kan ikke tappes videre mens timeren går
- spin-the-bottle i virtuell modus har en eksplisitt “Spinn flasken”-handling før selve kortet vises
- ferdigskjerm har vanlige handlingsknapper

Tap-to-advance er viktig fordi det:

- gjør spilløkten raskere
- fjerner UI-støy
- gjør opplevelsen mer “lean back”
- gjør det lettere å styre fra én telefon på vegne av hele rommet

### 2.4 Én skjerm er normaltilfellet

GameNight skal alltid tenkes som et én-enhets-produkt.

Det betyr:

- ingen synk mellom flere enheter
- ingen privat spillerhåndtering per person
- ingen separat controller-modell
- ingen krav om at alle skal ha mobilen oppe

TV-casting er ønsket, men innenfor samme modell:

- én enhet styrer
- samme UI brukes på mobil, desktop og castet skjerm

## 3. Visuell identitet

### 3.1 Mørk party-estetikk

Globalt tema er mørkt og festpreget:

- `background`: mørk, varm nesten-sort tone
- `card`: mørk, løftet flate
- `primary`: sterk rød/korall
- `accent`: varm gul
- generell sidebakgrunn bruker animert gradient, ikke flat farge

Produktet skal aldri føles lyst, corporate eller “produktivitets-app”-aktig. Selv SEO- og innholdssidene lever i samme mørke univers.

### 3.2 Gameplay-gradienter per korttone

Gameplay-shell og kort bruker sterke gradienter som følger korttype/tone:

- `challenge`: lilla -> dyp blå/lilla
- `never_have_i_ever`: rød -> oransje
- `prompt`: klar blå -> dypere blå
- `pointing`: cyan -> blå
- `versus`: indigoblå
- `truth_or_shot`: oransje
- `rule`: lilla
- `chaos`: rød -> sterk oransje
- `secret`: grønn/turkis

Dette betyr at korttype ikke bare er tekstlig. Den får også en umiddelbar scene-identitet.

### 3.3 Typografi og lesbarhet

Global font er `Poppins`.

I immersive gameplay er tekst satt opp for å tåle:

- mobil på nært hold
- desktop på avstand
- TV-casting i stue/kollektiv

Viktige typografiske regler i immersive kort:

- stor clamp-basert overskriftstekst
- relativt åpen `line-height` i området ca. `1.1` til `1.18`
- litt positiv `letter-spacing` i immersive modus, spesielt i landscape
- tekstlengde styrer egen “density”-modus: `default`, `compact`, `ultra`

Dette er viktig: GameNight bruker ikke ekstremt tight display-type i gameplay. Lesbarhet på avstand prioriteres over aggressiv branding.

### 3.4 TV- og landscape-regler

Landscape og større containere får egne justeringer:

- litt mindre tekst relativt til skjermhøyde
- høyere `letter-spacing`
- litt roligere `line-height`

Dette er et bevisst grep for casting. Kort skal være lesbare selv når folk ikke står rett foran skjermen.

### 3.5 UI-komponenter i gameplay

Gameplay-UI skal være så lett som mulig.

Primære elementer:

- sirkulær “forrige”-knapp øverst til venstre
- sirkulær “avslutt”-knapp øverst til høyre
- liten progresjonstekst nederst
- badge øverst over kortet
- selve kortteksten i sentrum

Sekundære elementer:

- diskrete spiller-highlights med glow
- timerknapp når kortet har nedtelling
- versus-knapper når kortet krever avstemning

Det skal ikke finnes:

- tung toppnavigasjon
- sidepaneler
- footer
- relaterte lenker
- innholdskolonner rundt gameplay

Mens gameplay er aktivt skjules vanlige sideelementer med `data-hide-during-gameplay`.

### 3.6 Timeruttrykket

Timeren er ment å føles minimalistisk og dramatisk:

- stor fullscreen-overlay med blur når timeren går
- gigantiske tall i midten
- tydelig “STOPP!” når tiden er ute
- lite eller ingen ekstra forklaring

Timeren er ikke en liten widget i et hjørne. Den er et sceneskifte.

### 3.7 Fremdriftsindikator

Fremdrift skal være subtil:

- liten tekst nederst som `3 / 50`
- ingen tung progress bar i immersive flyt

Kortet og rytmen er viktigere enn eksplisitt prosess-UI.

## 4. Produktflater: App vs Magazine

GameNight er delt i to hovedlag.

### 4.1 App-laget

Dette er produktets kjerne.

Ruter og ansvar:

- `/`:
  hjemmeflate med anbefalte spill, spilleroppsett, kategorier og raske innganger
- `/alle-spill`:
  bibliotekvisning med tag-filtrering og kjernebibliotek vs flere spill
- `/spill/[gameId]`:
  spillside med metadata, gameplay og relaterte spill/temaer
- `/oppsummering`:
  bonusflate basert på lokal spillerstatistikk

App-laget er der brukeren faktisk spiller.

### 4.2 Magazine-laget

Dette er oppdagelses-, SEO- og støtteflaten.

Viktige ruter:

- `/tema/[slug]`
- `/drikkeleker`
- `/drikkeleker/[slug]`
- `/musikkleker`
- `/skjermleker`
- `/fadderuka`
- `/russetiden`
- `/info/[slug]`
- `/faq`
- `/vilkar`
- `/changelog`

Magazine-laget skal:

- hente organisk trafikk
- forklare kontekst
- bygge tillit
- lede brukeren tilbake til spill

Det skal ikke ta over som hovedprodukt. Appen er fortsatt sentrum.

### 4.3 Viktig forhold mellom lagene

Hovedregelen er:

`innholdssider skal føre til spill, ikke konkurrere med dem`

Eksempler:

- temasider har promo-blokker inn i faktiske deck
- drikkelek-artikler peker til digitale partyspill i appen
- huber som `fadderuka` og `russetiden` setter spillkortene først og den lange guiden etterpå

## 5. Teknisk arkitektur

### 5.1 Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI-komponenter
- Framer Motion for animasjon

Arkitekturen er statisk-first:

- lokale JSON-filer er primær datakilde
- de fleste sider prerenderes
- repoet er rigget for statisk eksport

### 5.2 Ikke del av arkitekturen

Fremtidige AI-er skal ikke anta at følgende finnes:

- database
- auth
- server-side game state
- realtime multiplayer
- API-ruter som produktet er avhengig av
- CMS

Donasjon er en ekstern integrasjon. Den gjør ikke repoet til en backend-app.

### 5.3 Viktigste mapper

- `src/app/`: ruter, layout, metadata-ruter
- `src/components/game/`: gameplay, lobby, bibliotek, spillskjermer
- `src/components/themes/`: temasider
- `src/components/drikkeleker/`: artikkel- og listeflater
- `src/data/`: spilldeck, temaer og artikkeldata
- `src/lib/`: datalasting, typer, SEO, gameplay-hjelpere
- `src/hooks/`: klienthooks for session og preferanser
- `public/`: manifest, service worker, assets

### 5.4 Layout-shell

Root layout:

- setter mørkt tema globalt
- laster global animert bakgrunn
- registrerer PWA/service worker
- rendrer footer, cookie consent og monetiseringsgate på toppnivå

I aktiv spilling bytter appen fra vanlig side-layout til en fixed fullscreen gameplay-shell:

- `fixed inset-0`
- `h-[100svh]`
- `w-screen`
- ingen scroll
- alt rundt skjules

Dette skillet mellom vanlig side og aktiv shell er helt sentralt i produktet.

## 6. Game engine: hvordan spill faktisk kjører

### 6.1 Datakilden

Alle spill ligger som JSON-filer i `src/data/`.

`src/lib/games.ts` er kildesannhet for hvilke spill som faktisk finnes i appen.

Viktig:

- spill leses ikke ved å scanne filesystem i runtime
- ID-ene er eksplisitt listet i `canonicalGameIds`
- nye spill må legges til eksplisitt for å bli en del av produktet

### 6.2 Legacy aliaser

Repoet støtter noen legacy-ruter som peker til kanoniske spill:

- `girls-vs-boys` -> `lagduell`
- `spinn-flasken-ekte` -> `spinn-flasken` med override
- `spinn-flasken-virtuell` -> `spinn-flasken` med override

Dette betyr at URL og internt spill ikke alltid er 1:1. Ved SEO, temakoblinger og relaterte spill må man bruke kanonisk ID når det er riktig.

### 6.3 Validering

Spilldata valideres via `validateGame` i `src/lib/game-editor.ts`.

Det betyr at editor, dataimport og runtime bruker samme grunnmodell.

### 6.4 Spillstart og steglogikk

`GameFlow` er inngangsregissør for hvert spill.

Mulige steg:

- `consent`
- `mode_select`
- `instruction`
- `lobby`
- `playing`

Steg velges slik:

- spill med `warning` starter med samtykkeskjerm
- `spin-the-bottle` uten preset `spinMode` starter med modusvalg
- `physical-item` starter med instruksjonsskjerm
- `custom` kan bruke egen lobby
- ellers går spillet rett til `playing`

Spillerkrav kan overstyre dette og sende brukeren til en “gjør spillerne klare først”-skjerm.

### 6.5 Spillerliste

Spillere lagres i `localStorage` via `SessionProvider`.

Spillerobjekt:

- `id`
- `name`
- `stats.timesTargeted`
- `stats.tasksCompleted`
- `stats.penalties`

Viktig realitet:

- `penalties` finnes i datamodellen
- den oppdateres ikke aktivt i dagens gameplay-loop

### 6.6 Stokking og kortrekk

Når et spill starter:

- `game.items` stokkes hvis `shuffle !== false`
- oppgavene holdes i lokal state i `GameClient`
- kortrekk er sesjonslokalt, ikke persistert på tvers av refresh

### 6.7 Placeholder-systemet

Motoren kjenner disse tokenene:

- `{player}`
- `{player2}`
- `{all}`
- `{team1}`
- `{team2}`

Disse erstattes i runtime.

### 6.8 Rettferdig spillerutvelgelse

Når et kort bruker `{player}` eller `{player2}`:

- motoren velger spillere i klienten
- nylig valgte spillere får lavere vekt
- spillere som er mindre brukt får høyere sannsynlighet
- samme kortindeks beholder samme tildeling hvis man går tilbake

Dette er viktig: spillerutvelgelsen er ikke ren tilfeldig pick hver gang. Den er vektet for å spre spotlighten.

### 6.9 Navneskjuling

To kortfamilier skjuler navn med vilje:

- `never_have_i_ever`
- `pointing`

I disse typene brukes generiske ord i runtime:

- `{player}` -> `Noen`
- `{player2}` -> `En annen`

Dette er et viktig innholdsprinsipp:

- råkortene skal som hovedregel ikke skrives rundt ordet “noen”
- forfattere skal bruke riktig korttype og placeholders
- hvis motoren skal anonymisere, gjør den det selv

### 6.10 Spilltyper

`gameType` styrer spesialflyt:

- `default`: vanlig kortspill
- `spin-the-bottle`: flaske styrer hvem som er aktiv
- `physical-item`: fysisk gjenstand er sentral
- `versus`: lagduell med poeng

#### `spin-the-bottle`

To moduser:

- `virtual`: appen viser flaskeanimasjon og så kort
- `physical`: gruppen spinner selv og skjermen viser bare oppgaven

I spin-the-bottle brukes normalt ikke navneinnsetting.

#### `physical-item`

Disse spillene peker ikke ut en spiller via placeholders. Oppgaven leses høyt og gruppen håndhever den fysisk.

#### `versus`

`versus` brukes smalt. `lagduell` er dagens ene reelle lagspill.

Det gir:

- teamnavn
- teamfarger
- eksplisitte “Lag A vinner / Lag B vinner”-knapper
- scoreteller
- egen ferdigskjerm med vinner

### 6.11 Gameplay-presentasjon

`TaskCard` har to visuelle moduser:

- `default`
- `immersive`

Aktiv gameplay bruker `immersive`.

Det betyr at mye eldre/støttende UI-funksjonalitet i `default`-varianten ikke automatisk er live i selve spillopplevelsen.

### 6.12 Hva som faktisk vises på kortet i live gameplay

I immersive modus vises hovedsakelig:

- badge
- stor korttekst
- eventuelt timerkontroll
- eventuelt versus-knapper

Det som ikke er aktivt koblet inn i immersive gameplay i dag:

- `penalty` rendres ikke fra `GameClient`
- `sipAmount` rendres ikke fra `GameClient`
- `GameStartDialog` brukes ikke som pre-game steg
- drikkenivå-preferanser er ikke koblet til live kortvisning

Dette er en svært viktig realitet for fremtidige AI-er:

- felter kan finnes i schema, editor og data
- uten at de faktisk påvirker dagens immersive runtime

### 6.13 Timerstatus

Timer er en live feature.

Når et kort har `timer`:

- kortet får start/restart-kontroll
- nedtelling vises i kortet før start
- fullscreen blur-overlay tar over mens timeren går
- “STOPP!” vises når tiden er ute
- tap-to-advance er blokkert mens timeren kjører

Timer er derfor ekte runtime-funksjon, ikke bare metadata.

### 6.14 Regler og running rules

`rule`-feltet finnes og brukes i deckene.

Dagens runtime-realitet:

- regelkortets hovedtekst vises som vanlig korttekst
- strukturert `rule`-metadata rendres ikke som egen vedvarende UI i immersive gameplay
- gruppen forventes fortsatt å håndheve regelen sosialt
- aktive regler spores ikke i live gameplay-shell
- `ActiveRulesPanel.tsx` og `src/lib/game-rules.ts` finnes, men er ikke koblet inn i `GameClient`

Dette betyr:

- running rules er et faktisk innholdsmønster
- men ikke et fullt aktivt system med vedvarende UI i dagens produkt

### 6.15 `moment`-metadata

`moment` eksisterer fortsatt, men må forstås presist.

Verdier:

- `impact`
- `chaos`
- `secret`
- `group`

Live effekt i dag:

- `secret` påvirker tone/presentasjon
- `chaos` påvirker tone/presentasjon
- `impact` og `group` er i praksis mest redaksjonell metadata akkurat nå

Det finnes en egen `ImpactMomentReveal`-komponent og `getGameplayMoment()`-logikk, men denne reveal-flyten er ikke koblet inn i standard gameplay.

Ikke anta at `moment` automatisk lager eget mellomsteg på skjermen.

### 6.16 Tap-rytme og kontrollflater

Normal kontroll i live gameplay:

- trykk scenen for neste kort
- gå tilbake med venstre knapp
- avslutt med høyre knapp

Det finnes ikke en permanent gameplay-meny i immersive shell i dag.

### 6.17 Statistikk og oppsummering

Oppsummeringen er sosial bonus, ikke full telemetri.

Det som spores:

- `timesTargeted` for navngitte kort med reelle spillerplassholdere
- `tasksCompleted` for navngitte `challenge`, `prompt` og `truth_or_shot`

Det som ikke spores rikt:

- `pointing`
- `never_have_i_ever`
- `spin-the-bottle`
- `physical-item`
- `versus`
- straffer i betydningen faktisk gjennomført penalitet

## 7. Data- og innholdsarkitektur

### 7.1 Spilldeck

Et spill er et JSON-objekt med:

- identitet
- katalogmetadata
- flytmetadata
- liste med `items`

Viktige toppfelter:

- `id`
- `title`
- `description`
- `language`
- `items`
- `shuffle`
- `requiresPlayers`
- `minPlayers`
- `emoji`
- `color`
- `intensity`
- `audience`
- `category`
- `tags`
- `warning`
- `gameType`
- `spinMode`
- `teams`
- `hidden`
- `isHiddenFromMain`
- `custom`
- `region`
- `kommune`
- `instagram`

### 7.2 Kortmodell

Hvert kort har alltid:

- `type`
- `text`

Valgfrie felter:

- `rule`
- `moment`
- `timer`
- `sipAmount`
- `penalty`

Viktig tolkning:

- `timer` er live i gameplay
- `rule` er live som innhold, men ikke som vedvarende panel
- `sipAmount` og `penalty` er modellstøtte som ikke fullt ut er eksponert i immersive gameplay akkurat nå

### 7.3 Temaer

Temaer ligger i `src/data/themes.json`.

Et tema:

- samler relevante spill via `gameIds`
- har SEO-tekst
- kan bruke enten eldre `string[]`-innhold eller nyere blokkmodell

Nyere blokkmodell støtter:

- `section`
- `promo`

Systemet kan automatisk sette inn promo-blokker mellom seksjoner hvis de ikke finnes eksplisitt.

### 7.4 Drikkelek-artikler

Artikler i `src/data/drikkeleker.json` er ikke gameplay-deck. De er redaksjonelle oppslagsartikler.

De kan ha:

- `whatYouNeed`
- `rules`
- `cardRules`
- `variants`
- `intensity`
- `players`
- `tags`
- `sipAmount`
- `penalty`

Dette er “magazine data”, ikke aktiv deck-runtime.

### 7.5 Andre datafliser

Separate datafiler brukes for:

- `musikkleker`
- `screen-games`
- lokasjons-/customdata

## 8. Bibliotek, synlighet og kuratering

### 8.1 Biblioteket er manuelt kuratert

GameNight er ikke et automatisk bibliotek. Spill prioriteres manuelt.

`src/lib/game-library.ts` definerer:

- kjernevalg
- skjulte/spesialspill
- anbefalte spill på forsiden

### 8.2 Synlighetsnivåer

Et spill kan være:

- offentlig i hovedbiblioteket
- skjult fra hovedbiblioteket men tilgjengelig via direkte lenke eller spesialflate
- helt skjult

Tolkning:

- `hidden`: skjul bredt
- `isHiddenFromMain`: ikke vis i hovedbiblioteket, men la det eksistere i andre kontekster

### 8.3 Custom-spill og kampanjeflater

`custom`, `region`, `kommune` og `instagram` brukes særlig på russeflater og spesialspill.

Dette er ikke generisk CMS. Det er fortsatt håndkuratert data.

## 9. SEO-strategi

### 9.1 Hovedidé

SEO skal støtte produktet, ikke erstatte det.

Magasinflaten skal:

- hente søketrafikk
- gi nyttig kontekst
- sende brukeren videre til faktiske spill

### 9.2 Teknisk SEO

Metadata bygges sentralt gjennom `src/lib/seo.ts`.

Det inkluderer:

- canonical
- Open Graph
- Twitter card
- metadata base
- breadcrumb JSON-LD

I tillegg brukes:

- `Organization` JSON-LD
- `WebSite` JSON-LD
- `Article` JSON-LD på drikkelek-artikler
- `FAQPage` JSON-LD på FAQ

### 9.3 Nåværende begrensning i delingsbilder

SEO-systemet bruker i dag primært ett standard OG-bilde:

- `/GameNight-logo-small.png`

Ikke anta at spill- og temasider allerede har unike OG-assets. Det er ønsket retning, men ikke dagens baseline.

### 9.4 Noindex-regler

Disse skal normalt ikke konkurrere i søk:

- oppsummering
- takk
- print-flater
- skjulte spill

## 10. Innholdsregler og skrivestil

Dette er en av de viktigste delene av GameNight. Gameplay er bare så bra som kortteksten.

### 10.1 Standalone card rule

Hvert kort må kunne leses høyt som en komplett enhet.

Det betyr:

- kortet må gi mening uten ekstra forklaring
- kortet må ikke kreve at brukeren ser en kategorioverskrift for å forstå hva som skjer
- kortet må ikke lene seg på at folk kjenner forrige kort
- viktig logikk skal ikke gjemmes i liten hjelpetekst

Badge, farge og korttype er støtte. Selve teksten må bære handlingen.

### 10.2 Les-høyt-regelen

Et godt GameNight-kort:

- kan leses én gang
- forstås av hele rommet
- leder til umiddelbar handling eller umiddelbart svar

Hvis et kort trenger oppfølgingsforklaring, er det for komplekst.

### 10.3 Korte setninger vinner

Foretrukket kortstil:

- én hovedhandling
- ett tydelig spørsmål
- få sidevilkår
- lite parentesbruk

Unngå:

- lange regler med flere unntak
- forklarende tekst med “hvis, men, ellers, samtidig, med mindre”
- to helt ulike oppgaver i samme kort

### 10.4 Kortfamilier og forventet setningsform

#### `challenge`

Brukes for handling, tempo og sosial reaksjon.

Typisk struktur:

- `{player}, gjør X`
- `Alle gjør X`
- `{player}, du har 10 sekunder til X`

Språk:

- imperativt
- tydelig
- direkte

#### `prompt`

Brukes for spørsmål og refleksjon uten for mye admin.

Typisk struktur:

- `{player}, hva er ...?`
- `Hva er ... , {player}?`
- `Pest eller kolera: ...?`

Språk:

- muntlig
- lett å svare på høyt
- ikke essay-spørsmål

#### `pointing`

Brukes for kollektiv vurdering.

Typisk struktur:

- `Hvem her ...?`
- `Hvem i rommet ...?`

Språk:

- gruppen peker samtidig
- ikke navngitt enkeltperson i råtekst
- ikke bygg kortet som “Noen må ...”

#### `never_have_i_ever`

Skal nesten alltid starte med:

- `Jeg har aldri ...`

Dette er en sterk formregel. Ikke skriv denne kategorien som et vanlig spørsmål.

#### `truth_or_shot`

Skal føles som presskort.

Typisk struktur:

- `{player}, hva er ...?`
- `{all}: Har du ...? Hvis ja, tar du straffen.`

Språk:

- kort
- ærlig
- høy sosial spenning

#### `versus`

Må avslutte med en klar stemmelogikk.

Typisk struktur:

- `Hvilket lag ...?`

Kortet må være så tydelig at gruppen umiddelbart skjønner hva de stemmer over.

### 10.5 Placeholders er førstevalg, ikke generiske ord

Bruk placeholders når kortet trenger roller:

- `{player}` for én aktiv spiller
- `{player2}` for sekundær spiller
- `{all}` når alle faktisk skal delta
- `{team1}` og `{team2}` bare i lagspill

Ikke skriv:

- “noen må ...”
- “en person skal ...”
- “en tilfeldig spiller ...”

med mindre korttypen og formatet absolutt krever det.

Hvorfor:

- runtime kan selv velge spillere
- navngitte roller gir tydeligere scene
- generiske ord gjør kortet slappere å lese høyt

### 10.6 Ban på tvetydig “noen”

Redaksjonell regel:

- unngå ord som `noen` i råkorttekst når kortet egentlig bør peke ut en spiller, hele gruppen eller et lag

Unntak:

- runtime kan sette inn `Noen` automatisk for skjulte-navn-kort
- det er motorens jobb, ikke forfatterens

Dette gir en viktig stilforskjell:

- god råtekst: `{player}, gi 2 slurker til {player2}.`
- svak råtekst: `Noen må gi noen andre 2 slurker.`

### 10.7 Running rules må være sosialt håndhevbare

Regler som varer utover ett kort må være:

- korte
- enkle å huske
- lette å forklare
- realistiske å håndheve uten ekstra UI

Gode kategorier:

- forbudte ord
- navneregel
- tommelregel
- drikkevenn
- enkel husregel

Dårlige kandidater:

- regler som krever løpende tracking av mange tall
- regler som trenger eget panel for å fungere
- regler med mange unntak

### 10.8 Samtykke og trygghet

18+-spill skal være tydelige om grenser.

Råtekst og warnings skal:

- normalisere at man kan si nei
- unngå å presse frem ubehag
- være klare på respekt og samtykke

Målet er spenning og latter, ikke press.

## 11. Home, bibliotek og navigasjon

### 11.1 Forsiden

Forsiden skal være et kontrollrom for rask start:

- anbefalte spill først
- spillerliste høyt oppe
- kategorifilter rett etter
- sekundære innganger til artikler og huber nederst

Forsiden er ikke en tradisjonell innholdsportal. Den er en launchpad.

### 11.2 Alle spill

`/alle-spill` er bibliotekflaten med:

- filterchips
- kjernebibliotek
- flere spill
- metadata som intensitet, 18+, spillerkrav

Denne siden er bibliotek, ikke gameplay.

### 11.3 Spillside

`/spill/[gameId]` har dobbelt ansvar:

- være SEO-indekserbar landingsside
- være inngang til fullscreen gameplay

Derfor finnes relaterte spill, relaterte temaer og annonse under gameplay, men alt dette skjules visuelt under aktiv spilling.

## 12. Magazine-flater og redaksjonell filosofi

### 12.1 Temasider

Temasidene skal føles som “kuraterte kvelder”, ikke bare tagsider.

De kombinerer:

- introtekst
- seksjoner med faktisk råd og tone
- inline promo til konkrete deck
- spillgrid til slutt

### 12.2 Klassiske drikkeleker

Drikkelek-artiklene er oppslagsinnhold:

- hvordan spille
- hva man trenger
- varianter
- relaterte artikler
- CTA tilbake til digitale spill

Disse sidene er en del av magazine-laget, ikke av gameplay-motoren.

### 12.3 Huber

`/fadderuka` og `/russetiden` er hybridflater:

- spillvalg først
- guideinnhold etterpå
- tung SEO-tekst ligger i accordion eller senere i siden

Dette er et viktig mønster: app-funksjon først, langtekst etter.

## 13. Monetisering, consent og privacy-realisme

### 13.1 Faktisk status i koden

GameNight har live monetiseringslogikk, ikke bare placeholders.

Det som faktisk finnes:

- `CookieConsent`
- `ConsentManagedGoogleScripts`
- live Google Analytics-ID
- live Google AdSense-klient-ID
- `AdBanner` med faktisk ad-slot
- `AdAccessGate` som blokkerer deler av appen uten consent eller ved adblock
- ekstern donasjonsadapter

### 13.2 Hva dette betyr i praksis

Produktet er gratis, men ikke “helt friksjonsløst” i dagens implementasjon.

Monetisering påvirker faktisk opplevelsen gjennom:

- consent-banner
- fullscreen gate ved manglende consent
- adblock-detektering
- annonseflater på flere sider

Dette må enhver AI vite før den foreslår UX-endringer. Det finnes et bevisst spenn mellom produktideal og driftsmodell.

### 13.3 Donasjoner

Donasjon går til ekstern endpoint via `NEXT_PUBLIC_DONATION_API_URL`.

Repoet eier ikke checkout eller betalingsbackend.

## 14. PWA, hosting og drift

### 14.1 PWA

Repoet har:

- `manifest.json`
- `sw.js`
- install-prompt

Offline-støtte er begrenset og skal ikke overselges.

### 14.2 Hostingmodell

Foretrukket drift:

- statisk eksport
- Cloudflare Pages eller annen enkel statisk hosting

Ikke introduser SSR, OpenNext eller serverruntime uten veldig god grunn.

## 15. Live vs scaffolding

Dette er kritisk for fremtidige AI-samarbeid.

### 15.1 Live i dag

- fullscreen immersive gameplay-shell
- tap-to-advance
- fair player selection
- legacy alias-ruter
- samtykkeskjermer
- spin bottle virtual/physical
- physical-item-flow
- versus-flow med poeng
- timer-overlay
- SEO metadata og JSON-LD
- temaer og drikkelek-artikler
- consent-gated ads/analytics

### 15.2 Finnes i repoet, men er ikke koblet inn i live gameplay slik mange skulle tro

- `GameStartDialog` som reell startmodal
- drikkenivå som aktiv gameplay-innstilling
- `sipAmount` som synlig og skalert gameplay-straff
- `penalty` som live immersive kortseksjon
- `ActiveRulesPanel`
- `game-rules.ts` som aktiv runtime-tracker
- `ImpactMomentReveal`
- unike OG-bilder per side

### 15.3 Bevisst utenfor scope

- kontoer
- profiler
- database
- sanntids multiplayer
- tung admin/CMS
- kompleks regeladministrasjon midt i spill

## 16. Praktiske guardrails for fremtidige endringer

Når en AI skal endre GameNight, bør den følge disse reglene:

- prioriter én-skjerm-opplevelsen
- hold gameplay fullscreen og lettlest
- ikke reintroduser store “Neste”-knapper i normal kortflyt
- ikke anta at schemafelter er live bare fordi de finnes
- foretrekk dataendringer fremfor ny motorlogikk
- hold SEO-sider nyttige, men la dem lede til spill
- ikke bygg backend uten eksplisitt bestilling
- vær ærlig om forskjellen mellom produktideal og monetiseringsrealitet

## 17. Kort filkart for orientering

Hvis man likevel må slå opp i kode, er dette startpunktene:

- `src/app/page.tsx`: forsiderute
- `src/components/game/LobbyClient.tsx`: home/lobby-opplevelse
- `src/components/game/AllGamesClient.tsx`: bibliotek
- `src/app/spill/[gameId]/page.tsx`: spillside
- `src/components/game/GameFlow.tsx`: preplay-steg
- `src/components/game/GameClient.tsx`: live gameplay-loop
- `src/components/game/TaskCard.tsx`: kortpresentasjon
- `src/lib/games.ts`: spillregister og lasting
- `src/lib/game-library.ts`: kuratering og tiering
- `src/lib/themes.ts`: temamodell
- `src/lib/articles.ts`: artikkelmodell
- `src/lib/seo.ts`: SEO-baseline

## 18. Sluttregel

Hvis du bare husker én ting om GameNight, skal det være dette:

`GameNight er ikke bygget for å forklare spill. Det er bygget for å sette i gang kvelden raskt på én delt skjerm.`
