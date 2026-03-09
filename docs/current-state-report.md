# GameNight – Current State Report

Dato: 9. mars 2026  
Basert på: faktisk kode i repo (`/Users/naleyjanhelge/DEV/GameNight`), ikke bare README

## Executive summary
GameNight er i dag en innholdstung, statisk-first Next.js-app med mye faktisk verdi i form av spillinnhold, temahuber og tydelig mobilfokus. Kjernen fungerer: man kan starte spill, kjøre runder, håndtere spillere, få oppsummering, bruke PWA-funksjoner og kjøre statisk deploy.

Samtidig er det tydelig at prosjektet er i en «fungerende beta»-fase:
- Arkitekturen er enkel og robust for statisk hosting, men mye logikk er klientdrevet og delvis heuristisk.
- Spillmotoren er fleksibel nok for flere spilltyper, men modellen er inkonsistent på enkelte områder.
- Statistikken ser bra ut i UI, men er ikke event-drevet og samsvarer ikke alltid med faktisk gameplay.
- Dokumentasjonen er delvis god (README/hosting), men enkelte filer og tekster er utdaterte eller overlover funksjoner.

Kort vurdering: Godt fundament og høy innholdsgrad, men det trengs en konsolideringsrunde før større UX/produktløft.

## Metode og verifisering
Gjennomført i denne runden:
- Gjennomgang av ruter, komponenter, datafiler, libs og workflow-filer.
- Analyse av spilldata og feltbruk på tvers av alle JSON-filer.
- Bygg/verifisering:
  - `npm run build` (OK)
  - `npm run build:export` (OK)
  - `npm run typecheck` (OK etter ny build)

Merk:
- En tidlig `typecheck` feilet pga stale `.next/types`-referanser i lokalt miljø før ny build. Etter rebuild var typecheck grønn.

## Overordnet arkitektur
### Teknisk rammeverk
- Next.js 15 (App Router), React 19, TypeScript.
- UI: Tailwind + shadcn/ui + Radix-komponenter.
- Animasjoner: Framer Motion.
- Data: lokale JSON-filer (`src/data/*`) + noen statiske TS-konstanter.
- Ingen aktiv backend i repo.

### Viktige mapper og filer
- `src/app/`: alle ruter og layouts.
- `src/components/`: funksjonelle klientkomponenter (lobby, spillflyt, oppsummering, info, tema osv.).
- `src/data/`: spillinnhold, temaer, drikkelek-artikler, musikk/skjerm-data.
- `src/lib/`: datalasting (`games.ts`, `themes.ts`, `articles.ts`), typer, donations-adapter, basePath-hjelpere.
- `public/`: manifest, service worker, ikoner, bilder.
- `docs/`: arkitektur/hosting-notater.
- `.github/workflows/deploy-pages.yml`: statisk GitHub Pages deploy.

### Hvordan appen er bygget opp
- Server-komponenter på rutenivå henter data fra `src/lib/*`.
- Klientkomponenter står for interaksjon, state og visning.
- Spill- og innholdsdata er hardkodet i JSON/TS, ikke i database.

### Dataflyt gjennom systemet
Typisk flyt for spill:
1. JSON lastes via `getGames()/getGame()` i `src/lib/games.ts`.
2. Side (`src/app/spill/[gameId]/page.tsx`) henter spilldata og rendrer `GameFlow`.
3. `GameFlow` velger steg (samtykke, modusvalg, instruksjon, custom lobby, playing).
4. `GameClient` kjører oppgavekort, randomisering, visning og enkel poeng/statistikk.
5. Spillerstate/stats ligger i global klientkontekst (`src/app/providers.tsx`) og persisteres i `localStorage`.

### Statiske vs dynamiske deler
- Fullt statiske sider: blant annet `/`, `/alle-spill`, `/drikkeleker`, `/fadderuka`, `/russetiden`, `/musikkleker`, `/skjermleker`, `/oppsummering`, `/print/mingle-bingo`.
- SSG-ruter: `/spill/[gameId]`, `/drikkeleker/[slug]`, `/tema/[slug]`, `/info/[slug]`.
- Ingen server-API-ruter i bruk.

### Klientbaserte deler
- Spillerhåndtering og stats (`localStorage`).
- Spillkortflyt og randomisering.
- Deling/download (`html-to-image`, `navigator.share`).
- Donasjonskall mot ekstern endpoint.
- PWA install prompt + service worker-registrering.

### Forberedt for fremtidig backend/integrasjoner
- Donasjon er allerede abstrahert i adapter (`src/lib/donations.ts`) med `NEXT_PUBLIC_DONATION_API_URL`.
- Arkitekturen tillater ekstern API uten å bryte statisk deploy.
- Tomme API-kataloger finnes (`src/app/api/vipps/donate`), men ingen aktiv route.

## Hvordan prosjektet fungerer i dag (funksjonskart)
### Forside / lobby (`/`)
Hva den gjør:
- Viser anbefalte spill, tema-innganger, kategori-innganger, spilleroppsett, verktøykasse og donasjonsknapp.
- Har «Overrask meg»-dialog som velger random spill.

Teknisk:
- Data hentes i serverkomponent (`src/app/page.tsx`) og sendes inn i `LobbyClient`.
- Spilleroppsett via dialog (`PlayerSetup`) mot global session context.

Modenhet:
- Høy funksjonelt, tydelig struktur.

Svakheter/inkonsistens:
- Donasjon vises sentralt flere steder, men er avhengig av ekstern konfigurasjon.
- «Annonse»-felt er placeholders, ikke faktisk ad-nettverk.

### Alle spill (`/alle-spill`)
Hva den gjør:
- Søk + tag-filter + spillkort.

Teknisk:
- `AllGamesClient` bruker `useSearchParams`, søk/filter i klient.

Modenhet:
- Funksjonelt bra.

Svakheter/inkonsistens:
- Siden rendrer fallback («Laster spill...») i statisk HTML og bouncer til klientrender.
- Spillet `rt-2025-dummy` (markert `isHiddenFromMain`) vises her, fordi filterlogikken ikke bruker dette feltet i `getGames()`.

### Spillside og gameplay (`/spill/[gameId]`)
Hva den gjør:
- Kjører faktisk spillflyt med kortvisning, neste-kort, eventuelle warning/modal-steg, lagmodus og varianter.

Teknisk:
- `GameFlow` bestemmer steg basert på `warning`, `gameType`, `custom`.
- `GameClient` håndterer task-deck, randomisering, placeholder-substitusjon, enkel versus-score.

Modenhet:
- God bredde i støtte for ulike opplevelser.

Svakheter/bugs/inkonsistens:
- `spinn-flasken-ekte` mangler `gameType`, og får derfor ikke spin-UI/modusflyt, men vanlig kortflyt.
- `spinn-flasken-virtuell` har `gameType: spin-the-bottle`, men tvinger fortsatt brukeren gjennom modusvalg (virtuell vs fysisk), selv om varianten allerede er «virtuell».
- Spillerstatistikk oppdateres ved kortvisning (random spiller), ikke ved faktisk utført handling.

### Tema-sider (`/tema/[slug]`), Fadderuka og Russetiden
Hva den gjør:
- Temaer: redaksjonelle introtekster + kuratert spillliste.
- Fadderuka: kuraterte dagsblokker + SEO-artikkel + print-lenke.
- Russetiden: standardspill + custom-spill + promo/QR/story-generator.

Teknisk:
- Temaer drives av `themes.json`.
- Fadderuka og Russetiden er delvis hardkodet i sidekomponenter.
- Russetiden har faktisk delingsverktøy med QR og bildeexport.

Modenhet:
- Høy på innhold og kampanje-/segmentbruk.

Svakheter/inkonsistens:
- «Custom spill»-opplevelsen er i praksis knyttet til hardkodede datafiler; ingen faktisk selvbetjent oppretting i app.

### Drikkeleker-artikler (`/drikkeleker`, `/drikkeleker/[slug]`)
Hva den gjør:
- Artikkeloversikt + detaljsider med regler, varianter, utstyr, evt. kortregler.

Teknisk:
- Data fra `drikkeleker.json` + bildeattributter fra `placeholder-images.json`.

Modenhet:
- Stabil og ryddig funksjon.

Svakheter:
- Alt er statisk og manuelt vedlikeholdt; ingen CMS/workflow.

### Musikkeleker og skjermleker
Hva den gjør:
- Viser kategorier med regler.
- Musikkeleker lenker videre til Spotify.

Teknisk:
- Rent data-drevet fra egne JSON-filer.

Modenhet:
- Enkel, robust.

Svakheter:
- Ingen «spilling i app», kun liste/lenker/regeltekst.

### Oppsummering (`/oppsummering`)
Hva den gjør:
- Genererer «kveldens dom»-kort, tema-varianter, deling/nedlasting, konfetti.

Teknisk:
- Bruker lagret player stats fra localStorage-kontekst.
- Bilde genereres klientside via `html-to-image`.

Modenhet:
- Sterk sosial funksjon med høy delingsverdi.

Svakheter:
- Statistikkgrunnlaget er heuristisk og delvis kunstig (se spillmotor-seksjon).
- Ingen historikk per kveld eller per spill.

### PWA, installasjon og cookies
Hva den gjør:
- Viser install-knapp når `beforeinstallprompt` trigges.
- Service worker med app shell + runtime cache.
- Cookie-banner med lokal «jeg forstår»-lagring.

Teknisk:
- `public/sw.js`, `manifest.json`, `PwaInstallPrompt`, `CookieConsent`.

Modenhet:
- Grunnleggende PWA er på plass.

Svakheter:
- Offline-opplevelsen er ikke fullverdig «alt fungerer alltid offline».
- Cookie-banner har ikke avvisningsvalg og styrer ikke faktisk script-loading.

### Donasjonsflyt
Hva den gjør:
- Knapp(er) for Vipps/donasjon med valgt beløp (25/50/100 på Om oss).

Teknisk:
- `requestDonation(amount)` gjør POST mot `NEXT_PUBLIC_DONATION_API_URL`.
- Uten env-variabel: vennlig «ikke konfigurert»-melding.

Modenhet:
- God teknisk separasjon mellom frontend og backend.

Svakheter:
- Ingen innebygd betalingsbackend i repo.
- `/takk`-siden finnes, men er ikke direkte koblet fra frontend-flowen.

### Deling / QR / promo
Hva den gjør:
- Oppsummering: del/nedlast bilde.
- Russetiden custom-spill: kopierbar lenke, story-bilde og QR-bilde.

Teknisk:
- `navigator.share` + fallback til nedlasting.
- `react-qr-code` og `html-to-image`.

Modenhet:
- Reell, fungerende promo-mekanikk er implementert.

Svakheter:
- Konsentrert i enkelte deler av produktet, ikke en helhetlig delingsmodell overalt.

## Spillmotor og innholdsmodell
Dette er den viktigste delen, basert på faktisk implementasjon.

### Datamodell for spill
Antall spillfiler: 37 (`src/data/*.json`, ekskl. artikler/tema/musikk/skjerm).  
Totalt antall tasks: 1456.

Top-level felt brukt i spillfilene:
- Alltid: `id`, `title`, `description`, `language`, `items`, `shuffle`, `requiresPlayers`, `emoji`, `intensity`, `audience`, `category`.
- Valgfritt: `color`, `warning`, `gameType`, `teams`, `tags`, `custom`, `isHiddenFromMain`, `region`, `kommune`, `instagram`.

Task-format:
- `type`: `challenge | never_have_i_ever | prompt | pointing | versus`
- `text`: streng.

### Game types som faktisk støttes
- `default` (implisitt når `gameType` mangler): vanlig kortflyt.
- `versus`: stemmeknapper + score for to lag.
- `spin-the-bottle`: modusvalg (virtuell/fysisk) + spin-flow.
- `physical-item`: instruksjonsskjerm + fysisk-objekt-flow.

Faktisk fordeling:
- default: 29 spill
- physical-item: 3 spill
- spin-the-bottle: 4 spill
- versus: 1 spill

### Placeholders og spillerbruk i oppgaver
Støttede placeholders i tekst:
- `{player}`, `{player2}`, `{team1}`, `{team2}`, `{all}`

Hvordan de fylles:
- For hvert kort trekkes random `player1` og evt. `player2` fra spillerlisten (uten vedvarende balansemekanikk).
- `{team1}`/`{team2}` henter navn fra `teams`-felt.
- For `never_have_i_ever` og `pointing` maskeres navn til «Noen/En annen».

### Session/state/statistikk
Hvor state ligger:
- Global React context i `src/app/providers.tsx`.
- Persisteres i `localStorage` (`gamenight_players`).

Hva som lagres per spiller:
- `timesTargeted`
- `tasksCompleted`
- `penalties`

Hvordan stats oppdateres i dag:
- Ved hvert nytt kort: random `player1` får `timesTargeted +1`.
- Hvis korttype er `challenge`: samme spiller får `tasksCompleted +1`.
- `penalties` oppdateres ikke noe sted i nåværende kode.

### Viktige svakheter i dagens modell
- Stats er ikke knyttet til faktisk utførelse eller brukerinput. De er avledet av random kortallokering.
- `tasksCompleted` betyr ikke «faktisk fullført», men «challenge-kort der random player1 ble valgt».
- I spill som ikke er spiller-targeted (f.eks. spin/physical) kan stats likevel tikke hvis spillerliste finnes.
- `player2` brukes i tekst, men stats spores i praksis kun på `player1`.
- Ingen session-ID, ingen historikk per kveld, ingen reell analytics-modell.

### Datakvalitet og konsistens
- Modellfleksibilitet: høy (nye spill kan legges til raskt via JSON).
- Konsistens: middels.

Funn:
- Flere spillfiler har dupliserte tasks (bl.a. `spinn-flasken-sannhet`, `datingfail`, `fyllevalg`, `snusboksen`, `afterparty`).
- Skjult-logikk er splittet mellom `hidden` (ikke brukt i data) og `isHiddenFromMain` (brukt noen steder).
- Spill-IDer må vedlikeholdes manuelt i `allGameIds` i `src/lib/games.ts`.

Konklusjon på spillmotor:
- Fleksibel for innholdsdrevet utvikling.
- Sårbar for inkonsistens uten validering og strengere runtime-modell.

## UX-status (nåværende produktopplevelse)
### Generell flyt
Positivt:
- Rask inngang på forsiden.
- Tydelige temainnganger og «Overrask meg».
- God mobilvennlig struktur i hovedvisninger.

Friksjon:
- Spilleroppsett er valgfritt, men noen spill krever det; validering skjer sent (ved start av spill).
- Oppsummeringen ser «datadrevet» ut, men dataene bak er ikke helt tro mot faktisk spilladferd.

### Onboarding og oppstart av spill
Positivt:
- Advarselsskjerm for 18+/spicy-spill er tydelig.
- Egen instruksjonsflyt for fysisk-objekt-spill.

Friksjon:
- Variantspesifikke spin-spill har inkonsistent oppstart (ekte/virtuell-logikk er ikke konsekvent).

### Kortflyt / spillflyt
Positivt:
- Klar «ett kort av gangen»-modell.
- Versus-støtte fungerer teknisk.

Friksjon:
- Ingen adaptiv balansering av hvem som velges.
- Liten semantisk kobling mellom «det som faktisk skjedde» og stats/oppsummering.

### PWA/install-opplevelse
Positivt:
- Installerbar når browser støtter prompt.
- Service worker er enkel og driftsvennlig.

Friksjon:
- Offline-løftet er større i tekst enn i faktisk robusthet.
- Ingen iOS-spesifikk install-veiledning i UI.

### Oppsummering
Positivt:
- Høy «delbar»-faktor, tematisk og visuelt sterk.

Friksjon:
- Opplevelsen kan oppleves «falsk presis» siden målingene er heuristiske.

### Navigasjon og informasjonsstruktur
Positivt:
- Mange innganger til relevant innhold (tema, alle spill, nisjesider).

Friksjon:
- Noe repetisjon av innhold/konsepter på tvers av sider.
- Skjult/custom-logikk er ikke helt tydelig for bruker.

## Teknisk drift og hosting-status
### Lokal kjøring
- Fungerer med Node 20 (`.nvmrc`).
- Kommandoer:
  - `npm install`
  - `npm run dev`

### Build-status
- `npm run build` fungerer.
- `npm run build:export` fungerer og genererer `out/`.

### Static export
- `scripts/build-export.mjs` setter `STATIC_EXPORT=true` og kjører `next build`.
- `next.config.ts` bytter til `output: 'export'`, `trailingSlash: true`, `images.unoptimized` ved static export.

### GitHub Pages-realitet
- Realistisk per i dag.
- Workflow finnes og er riktig satt opp for artifact/deploy mot Pages.
- `basePath`-håndtering er implementert.

### Cloudflare-klarhet
- Løsningen er i praksis klar for statisk Cloudflare Pages-hosting nå.
- Ingen hard runtime-avhengighet til serverfunksjoner.

### Begrensninger for hosting
- Ingen backend-API i appen.
- Donasjoner krever ekstern endpoint.
- All dynamikk må være klientside eller pre-generert.

### Hvordan fremtidig donasjonsbackend bør passe inn
Anbefalt passform med dagens arkitektur:
- Behold frontend-adapter (`requestDonation`) som kontrakt.
- Legg betalingslogikk/webhooks i separat backend (Cloudflare Workers/Fly/Render/etc.).
- Returner stabil responskontrakt (`status`, `checkoutFrontendUrl`, `message`).

## Dokumentasjon og kvalitet
### README og docs
Styrker:
- README er relativt oppdatert på stack, static export og deploy.
- `docs/hosting.md` og `docs/architecture.md` stemmer i hovedsak med retningen.

Mangler/uklarhet:
- Deler av dokumentasjon og innholdstekster overlover funksjoner som ikke er implementert (f.eks. full offline/analytics/ads i praksis).
- `SPILL_OVERSIKT.md` har avvik mot faktisk antall oppgaver i flere spill.
- `public/llms.txt` beskriver delvis gammel virkelighet.

### Kodekvalitet og teknisk hygiene
- Ingen reell linting satt opp (`npm run lint` er placeholder).
- Ingen tester.
- Mye UI-komponenter ligger i repo uten faktisk bruk.
- Enkelte kataloger/filer er tomme/ubrukte (`src/app/api/vipps/donate`, `src/info`, `src/data/locations.ts`).
- Print-layout har strukturell markup-feil (nested `<html>` i output), som tyder på layout-inkonsistens.

## Teknisk gjeld og risiko
Høy risiko:
- Spillstatistikk og oppsummeringslogikk gir en opplevelse av presisjon uten reell event-tracking.
- Spilltype-inkonsistens i spin-variantene kan gi UX-forvirring.

Middels risiko:
- Manglende datavalidering av JSON-modell.
- Manuell vedlikehold av `allGameIds` og duplisert innhold.
- Dokumentasjonsavvik mellom tekst og faktisk kode.

Lav/middels risiko:
- Placeholder ad-system uten faktisk integrasjon.
- Cookie-consent uten reell consent-styring av scripts.

## Styrker ved dagens løsning
- Tydelig statisk-first arkitektur med lav driftskompleksitet.
- Mye ferdig innhold og mange innganger (tema, kampanjesider, artikler, musikk/skjermleker).
- Spillflyt med flere modus er allerede implementert.
- God basePath/Pages-tilpasning for billig hosting.
- Deling/QR/oppsummering gir tydelig produktverdi.

## Svakheter / begrensninger
- Spillmotoren er fleksibel, men delvis «skjør» pga inkonsekvent bruk av modellfelt.
- Stats/session-modellen er enkel og ikke robust nok for «ekte» metrikker.
- Innholdsforvaltning mangler validering og har tegn til duplisering/drift.
- Dokumentasjon og innholdstekster er ikke helt synkronisert med implementasjonen.
- Noen UX-detaljer føles halvferdige (variantflyt, offline-forventning, skjult/custom-logikk).

## Anbefalte fokusområder for neste fase
1. Konsolidere spillmotor-kontrakt ved å stramme inn `gameType`-semantikk og fjerne variant-inkonsistenser, spesielt i spin-flasken-flytene.
2. Re-designe statsmodellen fra heuristisk/random oppdatering til event-baserte handlinger (faktisk gjennomført oppgave, faktisk valgt spiller, faktisk straff).
3. Innføre datavalidering for innhold (for eksempel Zod) i build-step for spill, temaer og artikler.
4. Rydde «hidden/custom»-modellen med enhetlig feltsett og filtrering på tvers av forside, alle-spill, tema og kampanjesider.
5. Oppdatere dokumentasjon og produkttekst så README/docs/info-sider matcher faktisk funksjonalitet (analytics, ads, offline, custom-oppretting).
6. Rette layout/markup-avvik i print-ruten ved å fjerne nested `html/body` i underlayout.
7. Etablere minimum kvalitetssikring med reell linting, noen integrasjonstester og CI-sjekker for datafiler.
8. Planlegge backend-kontrakt for donasjon med tydelig API-kontrakt og konsistent feilhåndtering.
9. Prioritere UX-konsistens i oppstart og spillflyt, inkludert player-krav, variantvalg og forventningsstyring.
10. Forberede innholds- og produktstrategi for skalerbarhet med redaksjonell struktur, metadata-standard og enklere workflow for nye spill.
