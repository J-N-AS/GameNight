# SEO + Publisher Readiness (implementert)

Dato: 9. mars 2026  
Prosjekt: `/Users/naleyjanhelge/DEV/GameNight`

Denne filen beskriver hva som ble implementert etter auditen i `docs/seo-adsense-audit.md`, og hva som fortsatt må fylles inn før en faktisk AdSense-søknad.

## 1. Teknisk SEO

Implementert:
- Sentral SEO-helper i `src/lib/seo.ts` for:
  - canonical path/url
  - Open Graph metadata
  - Twitter card metadata
  - metadataBase-strategi
- Root metadata i `src/app/layout.tsx` bruker nå SEO-helper + `metadataBase`.
- Side-spesifikk metadata oppdatert på sentrale ruter.
- `noindex` lagt til for utility-sider:
  - `/oppsummering`
  - `/takk`
  - `/print/mingle-bingo`
- Skjulte spill (`hidden`/`isHiddenFromMain`) får `noindex` i `/spill/[gameId]`.

## 2. Structured data

Implementert:
- Global JSON-LD i layout:
  - `Organization`
  - `WebSite`
- Breadcrumb JSON-LD lagt til på sentrale sider (huber, tema, artikler, info, spill, trust-sider).
- `Article` JSON-LD på `/drikkeleker/[slug]`.
- `FAQPage` JSON-LD på `/faq`.

## 3. Semantikk

Implementert:
- Forside: semantisk `h1` (sr-only) i `LobbyClient`.
- Drikkelek-artikkel: semantisk `h1` + forbedret heading-hierarki.
- Infosider: semantisk `h1` (erstatter `CardTitle` som hovedoverskrift).
- Takk-side: flyttet til server-side route med metadata + semantisk `h1`.
- Spillsider: semantisk `h1` (sr-only) i server-ruten.

## 4. Internlenking og crawlbarhet

Implementert:
- `/alle-spill`: fjernet `useSearchParams`-bailout i client-komponenten.
  - Resultat: bedre server-rendret linkgraf i statisk HTML.
- `/alle-spill`: la til tema-lenker (`/tema/*`) over spillgrid.
- `/spill/[gameId]`: la til server-rendret seksjon med:
  - relaterte spill
  - relaterte temaer
- `/drikkeleker/[slug]`: la til relaterte artikler + relevante spill-lenker.

## 5. Trust/publisher-sider

Nye sider:
- `/faq`
- `/changelog`
- `/vilkar`

Oppdatert:
- Footer har nå tydelige lenker til trust-sidene.
- Footer viser utgiver/kontakt (`hei@gamenight.no`).

## 6. ads.txt

Implementert:
- `public/ads.txt` lagt til som placeholder.

Må gjøres før live annonser:
- Erstatt placeholder med faktisk AdSense-linje, for eksempel:
  - `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`

## 7. Metadata-ruter

Implementert:
- `src/app/robots.ts` lagt til for dynamisk robots metadata.
- `src/app/sitemap.ts` oppdatert med:
  - canonical-origin-strategi
  - nye trust-sider (`/faq`, `/changelog`, `/vilkar`)

## 8. Åpen TODO før AdSense-søknad

1. Sett endelig `NEXT_PUBLIC_CANONICAL_ORIGIN` i produksjonsmiljø.
2. Sett ekte publisher-record i `public/ads.txt`.
3. Bekreft at cookie/consent-løsning møter regulatoriske krav i målmarked (særlig EØS/UK).
4. Gjør en manuell policygjennomgang av 18+-innhold før innsending.
