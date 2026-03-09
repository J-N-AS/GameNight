# GameNight

GameNight er en norsk Next.js App Router webapp/PWA for fest- og drikkespill.
Prosjektet er nå satt opp som **statisk-first**, med JSON-basert innhold og uten hard avhengighet til server-runtime.

## Status (per 9. mars 2026)

Implementert:
- Next.js App Router + TypeScript
- Spillinnhold og temainnhold fra lokale JSON-filer (`src/data/*`)
- Global spillerøkt i klient (localStorage)
- PWA-manifest + service worker (offline cache av app shell + runtime assets)
- Statisk generering av dynamiske ruter via `generateStaticParams`
- Valgfri donasjonsintegrasjon mot ekstern endpoint (ingen innebygd backend)

Ikke implementert:
- Login/auth
- Adminside
- Database
- Ekte betalingsbackend i repo

## Produktprinsipp: én enhet

GameNight er designet for én skjerm per spilløkt:
- én mobil/nettleser styrer kortene
- lokal session/state i klient (`localStorage`)
- evt. skjermdeling/casting til TV for større gruppe

Appen bygger bevisst ikke multiplayer eller sanntids-synk mellom flere enheter.

## Teknologi

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind + shadcn/ui + Radix
- Framer Motion
- JSON-filer som primær datakilde

## Krav

- Node.js 20 (se `.nvmrc`)
- npm 10+

## Kom i gang lokalt

```bash
npm install
npm run dev
```

Åpne: `http://localhost:3000`

## Scripts

- `npm run dev`: start dev-server (Turbopack)
- `npm run dev:classic`: start dev-server uten Turbopack
- `npm run typecheck`: TypeScript-sjekk
- `npm run build`: produksjonsbuild (Next)
- `npm run build:export`: statisk eksport (`output: 'export'`)
- `npm run start`: start produksjonsserver for vanlig Next-build
- `npm run lint`: placeholder (ESLint er ikke konfigurert i repoet ennå)
- `npm run check`: typecheck + build

## Miljøvariabler

Kopier fra `.env.example` ved behov.

- `NEXT_PUBLIC_SITE_URL`
  - Valgfri absolutt URL for delingslenker/QR-koder.
  - Eksempel: `https://gamenight.no`
- `NEXT_PUBLIC_BASE_PATH`
  - Valgfri base path for repo-hosting (GitHub Pages).
  - Eksempel: `/GameNight`
- `NEXT_PUBLIC_DONATION_API_URL`
  - Valgfri donasjons-endpoint.
  - Hvis tom: UI viser «ikke konfigurert»-melding.

## Render-modell (statisk-first)

### Fullt statiske sider
- `/`
- `/alle-spill`
- `/drikkeleker`
- `/fadderuka`
- `/russetiden`
- `/musikkleker`
- `/skjermleker`
- `/oppsummering`
- `/takk`
- `/print/mingle-bingo`

### SSG-ruter (prerenderes fra datafiler)
- `/spill/[gameId]`
- `/drikkeleker/[slug]`
- `/tema/[slug]`
- `/info/[slug]`

Alle over bygges statisk via `generateStaticParams`.

### Metadata-rute
- `/sitemap.xml` genereres statisk i build.

## Donasjoner (isolert, hostinguavhengig)

Donasjonsknapper bruker en klient-side adapter i `src/lib/donations.ts`:
- Leser `NEXT_PUBLIC_DONATION_API_URL`
- Sender `POST { amount }` til ekstern endpoint
- Forventer JSON med felt som `status` og ev. `checkoutFrontendUrl`

Dette gjør at repoet kan kjøre statisk uten innebygd betalingsbackend.

## Prosjektstruktur (kort)

- `src/app/`: ruter, layouts, metadata-ruter
- `src/components/`: UI + spillflyt + innholdskomponenter
- `src/data/`: spill/artikler/tema i JSON/TS
- `src/lib/`: datalasting, typer, hjelpefunksjoner
- `public/`: manifest, service worker, bilder, statiske assets
- `docs/`: tekniske notater om arkitektur/hosting

## Hosting

Se:
- [`docs/hosting.md`](docs/hosting.md)
- [`docs/architecture.md`](docs/architecture.md)

Kort oppsummert:
- **GitHub Pages beta**: realistisk via `npm run build:export`
- **Cloudflare langsiktig**: appen er nå i praksis klar for billig statisk hosting

## GitHub Pages deploy (automatisk)

Repoet er satt opp med workflow:
- `.github/workflows/deploy-pages.yml`

Den gjør følgende ved push til `main` (og ved manuell kjøring):
- installerer dependencies
- kjører typecheck
- bygger statisk eksport (`npm run build:export`)
- publiserer `out/` til GitHub Pages via artifact/deploy-flyt

Workflowen setter:
- `NEXT_PUBLIC_BASE_PATH=/GameNight`
- `NEXT_PUBLIC_SITE_URL=https://<github-bruker>.github.io`

Forventet beta-URL:
- `https://<github-bruker>.github.io/GameNight/`

Manuell GitHub-oppsett (én gang):
1. Gå til **Settings → Pages** i repoet.
2. Sett **Source** til **GitHub Actions**.

## Kvalitetssikring

Kjør før deploy:

```bash
npm run typecheck
npm run build
npm run build:export
```

## Innholdsflyt

Nye spill legges primært inn i `src/data/<spill-id>.json`.
Husk å legge `id` i `allGameIds` i `src/lib/games.ts`.

For spin-flasken-spill støttes:
- `gameType: "spin-the-bottle"`
- `spinMode: "choose" | "virtual" | "physical"`
  - `choose`: brukeren velger modus i oppstart
  - `virtual`/`physical`: oppstart hopper direkte til riktig flyt

## Lisens

Ingen lisensfil er definert i repoet per nå.
