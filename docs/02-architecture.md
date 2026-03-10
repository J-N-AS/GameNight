# Teknisk arkitektur

## Oversikt

GameNight er en statisk-first Next.js 15-app med App Router. Produktet fungerer uten database og uten innebygd backend. Spilldata og SEO-innhold ligger lokalt i repoet, og de fleste sider kan prerenderes.

## Viktigste mapper

| Sti | Ansvar |
| --- | --- |
| `src/app/` | ruter, layouts, metadata-ruter |
| `src/components/` | UI-komponenter og klientflyt |
| `src/data/` | spillfiler, temaer, artikler og øvrig innhold |
| `src/lib/` | typer, datalasting, SEO, gameplay-hjelpere |
| `src/hooks/` | klienthooks for spillerstate og spillstart |
| `public/` | manifest, service worker, ikoner og statiske assets |

## Datakilder

Kildesannhet i dagens løsning:

- spill: `src/data/*.json`
- temaer: `src/data/themes.json`
- drikkelek-artikler: `src/data/drikkeleker.json`
- musikkleker: `src/data/musikkleker.json`
- skjermleker: `src/data/screen-games.json`
- info-sider: metadata og innhold i kode under `src/lib/info-pages.ts` og klientkomponenter

Spill-ID-ene som faktisk lastes ligger eksplisitt i `src/lib/games.ts`.

## Render-modell

### Statisk genererte sider

Faste sider som `/`, `/alle-spill`, `/drikkeleker`, `/fadderuka`, `/russetiden`, `/musikkleker`, `/skjermleker`, `/faq`, `/changelog`, `/vilkar`, `/oppsummering` og `/takk` bygges som vanlige App Router-sider.

### SSG-ruter

Disse rutene prerenderes fra lokale data via `generateStaticParams`:

- `/spill/[gameId]`
- `/tema/[slug]`
- `/drikkeleker/[slug]`
- `/info/[slug]`

### Metadata-ruter

- `src/app/sitemap.ts`
- `src/app/robots.ts`

Disse bruker samme datakilder som resten av appen.

## Dataflyt

### Spill

1. `src/lib/games.ts` laster JSON-filen for valgt spill-ID
2. `src/app/spill/[gameId]/page.tsx` henter spilldata og metadata
3. `GameFlow` styrer oppstartssteget
4. `GameClient` kjører selve gameplay-løkken

### Temaer

1. `src/lib/themes.ts` leser `themes.json`
2. temasiden matcher `gameIds` mot spillbiblioteket
3. `ThemePageClient` rendrer tekst + spillkort

### Artikler

1. `src/lib/articles.ts` leser `drikkeleker.json`
2. artikkelen kobles mot bilde-metadata i `placeholder-images.json`
3. artikkelsiden får metadata og JSON-LD i rute-filen

## Klientstate

Det finnes to viktige former for klientstate:

- spillerliste og enkel statistikk i `SessionProvider` (`localStorage`)
- aktiv spillsession i `GameClient` (`useState`, ikke globalt persistert)

Dette betyr:

- spillere kan overleve en sideoppfriskning
- running rules gjør det ikke
- oppsummeringen bygger på lokal spillerstate

## Spillmotorens plass i systemet

Gameplay-systemet ligger primært i:

- `src/components/game/GameFlow.tsx`
- `src/components/game/GameClient.tsx`
- `src/components/game/TaskCard.tsx`
- `src/components/game/ActiveRulesPanel.tsx`
- `src/lib/gameplay.ts`
- `src/lib/game-rules.ts`

Se `03-game-system.md` for detaljer.

## SEO-laget

SEO bygges sentralt gjennom:

- `src/lib/seo.ts`
- metadata i rute-filer
- `JsonLd`-komponenten
- sitemap og robots-ruter

Hidden-spill og utility-sider kan markeres med `noindex`.

## PWA og offline

Repoet har:

- `public/manifest.json`
- `public/sw.js`
- install-prompt i klient

Offline-støtten er begrenset. App shell og tidligere besøkte assets kan caches, men repoet lover ikke full offline-spilling i alle situasjoner.

## Hosting

Appen kan kjøres på to måter:

- vanlig Next-build med `npm run build`
- statisk eksport med `npm run build:export`

Statisk eksport er førstevalg for enkel hosting og GitHub Pages. `next.config.ts` håndterer `output: 'export'`, `basePath` og `assetPrefix` når miljøet krever det.

## Begrensninger som skal respekteres

- ingen database eller auth i repoet
- ingen API-ruter i dagens løsning
- donasjoner går til ekstern endpoint, ikke lokal backend
- multiplayer og sanntids-synk er ikke del av arkitekturen
