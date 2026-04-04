# GameNight

GameNight er en norsk, statisk-first Next.js-app for festspill, drikkeleker, isbrytere og temabaserte selskapsleker. Produktet er bygget for én felles skjerm: én mobil eller nettleser styrer spilløkten, mens resten av gruppen spiller sammen i samme rom.

## Kom i gang

Krav:
- Node.js 20 (`.nvmrc`)
- npm 10+

Lokal oppstart:

```bash
npm install
npm run dev
```

Åpne `http://localhost:3000`.

Nyttige scripts:
- `npm run dev` starter utviklingsserveren
- `npm run typecheck` kjører TypeScript-sjekk
- `npm run build` bygger vanlig Next-app
- `npm run build:export` bygger statisk eksport for GitHub Pages / enkel hosting
- `npm run build:cloudflare` bygger statisk eksport for Cloudflare Pages
- `npm run check:cloudflare` kjører typecheck + Cloudflare-bygg lokalt

## Kort arkitektur

- Next.js 15 App Router + React 19 + TypeScript
- Spill, temaer og artikler ligger lokalt i `src/data/`
- Spillmotoren er klientdrevet og bruker `localStorage` for spillerliste og enkel oppsummeringsstatistikk
- Ingen database, auth eller innebygd backend i repoet
- Donasjon er en valgfri ekstern integrasjon via `NEXT_PUBLIC_DONATION_API_URL`
- SEO, sitemap og metadata bygges i appen og fungerer også for statisk eksport

Viktige mapper:
- `src/app/` ruter og metadata-ruter
- `src/components/` UI og spillflyt
- `src/data/` spilldata, temaer og artikler
- `src/lib/` datalasting, typer og spillrelatert logikk
- `docs/` levende dokumentasjon

## Dokumentasjon

- `docs/GAMENIGHT_MASTER.md` hoveddokumentet og kildesannhet for arkitektur, UX og innholdsregler
- `docs/01-product.md` hva GameNight er og hva produktet prøver å løse
- `docs/02-architecture.md` teknisk arkitektur, render-modell og hosting
- `docs/03-game-system.md` hvordan gameplay-systemet og spillkortene fungerer
- `docs/04-game-library.md` hvordan spillbiblioteket er strukturert og hvordan nye spill legges til
- `docs/05-gameplay-design.md` gameplay-prinsipper, kortrytme, impact moments og running rules
- `docs/06-ux-guidelines.md` produktnære UX-prinsipper for videre arbeid
- `docs/07-seo-strategy.md` SEO-struktur, temasider og innholdsproduksjon
- `docs/08-monetization.md` dagens monetisering og prinsipper for videre arbeid
- `docs/09-roadmap.md` prioritert roadmap
- `docs/10-cloudflare-pages-setup.md` manuell sjekkliste for Cloudflare Pages og custom domain
- `docs/ai-context.md` kort kontekst for AI-verktøy
- `SPILL_OVERSIKT.md` oversikt over spillbiblioteket

## Miljøvariabler

Kopier fra `.env.example` ved behov.

- `NEXT_PUBLIC_SITE_URL` offentlig basis-URL for delingslenker
- `NEXT_PUBLIC_CANONICAL_ORIGIN` foretrukket SEO-origin
- `NEXT_PUBLIC_BASE_PATH` base path for repo-hosting
- `NEXT_PUBLIC_DONATION_API_URL` ekstern donasjons-endpoint

## Deploy

Repoet kan kjøres som vanlig Next-app eller som statisk eksport.

Cloudflare Pages:
- Build command: `npm run build:cloudflare`
- Build output directory: `out`
- Node.js version: `20`
- Bruk statisk eksport for denne appen. Ikke legg til OpenNext eller `@opennextjs/cloudflare` med mindre dere faktisk går over til SSR eller API-ruter.
- Se `docs/10-cloudflare-pages-setup.md` for alt som må settes manuelt i Cloudflare

GitHub Pages:
- Build command: `npm run build:export`
- Workflow finnes i `.github/workflows/deploy-pages.yml`
