# Arkitekturstatus

Denne filen beskriver hvordan GameNight faktisk fungerer etter oppryddingen.

## 1. Datamodell

- Primærkilde: lokale datafiler i `src/data/`
- Spill: `src/data/*.json`
- Tema: `src/data/themes.json`
- Artikler: `src/data/drikkeleker.json`
- Spillmodell for spin-varianter:
  - `gameType: "spin-the-bottle"`
  - `spinMode: "choose" | "virtual" | "physical"` for konsistent oppstartsflyt
- Spill kan i tillegg ha `minPlayers` ved behov.
  - Hvis `minPlayers` mangler, bruker appen en enkel standard:
    - `2` for spill som krever spillerliste
    - `2` for `spin-the-bottle` og `physical-item`
    - `0` ellers
- Offentlige lister skjuler spill med `hidden` eller `isHiddenFromMain`, men rutene kan fortsatt statisk genereres ved behov.

Det finnes ingen database eller backend-datalag i repoet.

## 1.1 Én-enhets-opplevelse

- Appen er designet for én skjerm per session (mobil eller delt skjerm/TV-casting).
- Ingen multiplayer/sanntids-sync mellom flere klienter.
- Spillerliste og enkel spillstatistikk lagres lokalt i nettleseren.
- FAQ/Om oss forklarer også anbefalt bruk med AirPlay, Android-casting og skjermdeling.

## 2. Render-strategi

## Statiske sider

- `/`, `/alle-spill`, `/drikkeleker`, `/fadderuka`, `/russetiden`, `/musikkleker`, `/skjermleker`, `/faq`, `/changelog`, `/vilkar`, `/oppsummering`, `/takk`, `/print/mingle-bingo`

## Dynamiske path-segmenter (men statisk generert)

- `/spill/[gameId]` via `generateStaticParams`
- `/drikkeleker/[slug]` via `generateStaticParams`
- `/tema/[slug]` via `generateStaticParams`
- `/info/[slug]` via `generateStaticParams`

## Metadata-ruter

- `/sitemap.xml` genereres statisk (`dynamic = 'force-static'`).
- `/robots.txt` genereres via `src/app/robots.ts`.

## 3. Runtime-avhengigheter

Klient-runtime (nettleser):
- `localStorage` for spillerøkt og cookie-consent
- Service worker (`public/sw.js`) for PWA/offline
- Deling/download (`navigator.share`, `html-to-image`)
- Donasjon via valgfri ekstern endpoint (`NEXT_PUBLIC_DONATION_API_URL`)

Server-runtime i repo:
- Ingen API-ruter (`src/app/api/*` er fjernet)

## 4. Hosting-uavhengighet

Prosjektet er nå hostinguavhengig i praksis:
- Ingen Firebase-spesifikk runtime i kode
- Ingen innebygd betalingsbackend
- Donasjon er isolert som ekstern integrasjon

Fjernet i oppryddingen:
- `src/app/api/vipps/donate/route.ts`
- `apphosting.yaml`
- Ubrukt Firebase-avhengighet

## 5. PWA-status

Forenklet service worker:
- Cacher app shell
- Runtime-caching av same-origin assets
- Navigasjon fallback til cache ved offline
- Bruker relative paths (`./...`) for bedre basePath-kompatibilitet

Installflyt:
- Install-prompt vises bare når `beforeinstallprompt` faktisk er tilgjengelig.
- Prompten er tonet ned til en mobil-først bottom sheet og skjules på desktop.
- Hvis brukeren avviser prompten, holdes den borte en stund via lokal cooldown i `localStorage`.

## 6. Kjente begrensninger

- Uten `NEXT_PUBLIC_DONATION_API_URL` er donasjon deaktivert (forventet).
- Uten `NEXT_PUBLIC_CANONICAL_ORIGIN` brukes fallback-origin (`https://gamenight.no`) i canonical/sitemap/robots metadata.
