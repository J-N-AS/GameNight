# Arkitekturstatus

Denne filen beskriver hvordan GameNight faktisk fungerer etter oppryddingen.

## 1. Datamodell

- Primærkilde: lokale datafiler i `src/data/`
- Spill: `src/data/*.json`
- Tema: `src/data/themes.json`
- Artikler: `src/data/drikkeleker.json`

Det finnes ingen database eller backend-datalag i repoet.

## 2. Render-strategi

## Statiske sider

- `/`, `/alle-spill`, `/drikkeleker`, `/fadderuka`, `/russetiden`, `/musikkleker`, `/skjermleker`, `/oppsummering`, `/takk`, `/print/mingle-bingo`

## Dynamiske path-segmenter (men statisk generert)

- `/spill/[gameId]` via `generateStaticParams`
- `/drikkeleker/[slug]` via `generateStaticParams`
- `/tema/[slug]` via `generateStaticParams`
- `/info/[slug]` via `generateStaticParams`

## Metadata-ruter

- `/sitemap.xml` genereres statisk (`dynamic = 'force-static'`).

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

## 6. Kjente begrensninger

- Uten `NEXT_PUBLIC_DONATION_API_URL` er donasjon deaktivert (forventet).
- `robots.txt` peker fortsatt på `https://gamenight.no/sitemap.xml`.
  - Dette er riktig for produksjonsdomene, men ikke for midlertidig preview-domener.
