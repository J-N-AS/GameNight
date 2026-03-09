# GameNight SEO + AdSense Audit

Dato: 9. mars 2026  
Prosjekt: `/Users/naleyjanhelge/DEV/GameNight`  
Scope: Kode- og build-basert analyse (ingen refaktorering/redesign)

## Executive summary
GameNight har et godt fundament for organisk trafikk: statisk eksport, bred innholdsflate, unike titler/beskrivelser og tydelige temasider. Samtidig er det flere strukturelle hull som holder både SEO og AdSense-readiness tilbake.

Kort status:
- SEO-grunnmur: **middels-god**
- AdSense readiness: **middels-lav**
- UX-vennlige annonseflater: **godt potensial**

Mest kritisk:
1. Mangler canonical, Open Graph, Twitter-kort og structured data.
2. `/alle-spill` bouncer til client-side rendering i statisk HTML (svak crawlbar internlenking mot mange spillsider).
3. Mange sider mangler semantisk `<h1>`.
4. Innhold med tydelig seksuelt/18+ preg gir reell AdSense-policy-risiko.

## SEO status

### Ruter og struktur (App Router)
Identifiserte hovedruter:
- Statisk: `/`, `/alle-spill`, `/drikkeleker`, `/fadderuka`, `/russetiden`, `/musikkleker`, `/skjermleker`, `/oppsummering`, `/takk`, `/print/mingle-bingo`
- SSG (dynamisk): `/spill/[gameId]`, `/drikkeleker/[slug]`, `/tema/[slug]`, `/info/[slug]`
- Metadata-rute: `/sitemap.xml`

Bygget eksport:
- 74 HTML-sider totalt (inkl. `/404`)
- 69 URL-er i sitemap
- 5 sider ikke i sitemap: `/404`, `/oppsummering`, `/print/mingle-bingo`, `/spill/rt-2025-dummy`, `/takk`

### Metadata i Next.js
Det som er bra:
- Global `metadata` i root layout.
- Unike titles/descriptions på de fleste sider.
- `generateMetadata` på dynamiske ruter (`/spill/[gameId]`, `/drikkeleker/[slug]`, `/tema/[slug]`, `/info/[slug]`).
- 0 sider uten `<title>` eller meta description i build-output.

Mangler:
- Ingen canonical tags.
- Ingen Open Graph-tags.
- Ingen Twitter card-tags.
- Ingen `metadataBase` (viktig når siden kan nås via flere hoster/domener).
- `takk`-siden arver generisk forside-metadata i stedet for side-spesifikk metadata.
- Print-siden arver generisk description.

### URL- og sidearkitektur
Det som fungerer:
- Temahuber (`/tema/*`, `/fadderuka`, `/russetiden`) fungerer som gode SEO-landingssider.
- Drikkelek-artikler har tydelig URL-struktur og konsistent intent.

Mangler:
- Flere "utility"-sider er indexerbare uten tydelig søkeintensjon (`/oppsummering`, `/takk`, `/print/mingle-bingo`, skjult custom-spill).
- Ingen noindex-strategi for sider som primært er funksjonelle flyter.

## Content structure

### Innholdstyper analysert

1. Spill (`/spill/[gameId]`)
- Volum: 37 spill
- Styrke: Mye faktisk innhold i JSON-kort, høy bredde i tematikk.
- Svakhet: Sidene oppfører seg mer som interaktive verktøy enn forklarende landingssider.
- SEO-vurdering: Mange spillsider har begrenset semantisk tekststruktur på sidenivå.

2. Artikler om klassiske drikkeleker (`/drikkeleker/[slug]`)
- Volum: 12 artikler
- Estimert tekstdybde: ca. 94–355 ord per artikkel (snitt ~163)
- Styrke: Klar how-to-struktur (utstyr, regler, varianter/kortregler).
- Svakhet: Mangler semantisk `<h1>` i artikkelvisningen.

3. Temahuber (`/tema/[slug]`, `/fadderuka`, `/russetiden`)
- Volum: 11 tema-sider + 2 dedikerte hub-sider
- Estimert tekstdybde på `/tema/*`: ca. 112–150 ord per side
- Styrke: God hub-struktur med introtekst + kuraterte spill-lenker.
- Svakhet: Flere temaer kunne hatt mer dybdetekst/FAQ for long-tail.

4. Musikkeleker (`/musikkleker`)
- Volum: 20 oppføringer i 3 kategorier
- Estimert tekstdybde: ~21 ord per oppføring
- Vurdering: Mer katalog enn artikkel. Begrenset tekst per URL for organisk ranking.

5. Skjermleker (`/skjermleker`)
- Volum: 9 oppføringer i 3 kategorier
- Estimert tekstdybde: ~31 ord per oppføring
- Vurdering: Mer katalog enn artikkel. Trenger mer forklarende innhold for SEO-tyngde.

### Oppsummering av innholdskvalitet for SEO
- **Sterkest:** Drikkelek-artikler, Fadderuka, Russetiden, temahuber.
- **Middels:** Forside og hub-kategorier.
- **Svakest:** Enkelte spillsider, musikkeleker/skjermleker (tynn tekst per underenhet).

## Internal linking

### Hvordan sider lenker i dag
- Forsiden lenker til sentrale huber, temaer og et begrenset antall anbefalte spill.
- Footer gir bred sitewide-lenking til toppnivåsider (om oss/personvern/kontakt + hovedkategorier).
- Drikkelek-listen lenker til alle drikkelek-artikler.
- Temasider lenker til sine kuraterte spill.

### Funn
- Flere spillsider er svakt koblet eller isolerte i statisk linkgraf.
- Drikkelek-artikler har i praksis lav intern dybdelenking (typisk tilbake til liste, lite "relaterte artikler/spill").
- Temasider har normalt kun én tydelig inngang (fra forsiden).

### Kritisk teknisk funn
`/alle-spill` er i statisk HTML en client-side bailout (`BAILOUT_TO_CLIENT_SIDE_RENDERING`) og viser kun fallback-tekst før hydrering.  
Konsekvens: mange spill-lenker finnes ikke som server-renderte `<a>` i HTML-kilden på denne siden, noe som svekker intern crawl/discovery.

## AdSense readiness

### Positive signaler
- Nettstedet fremstår som ekte produkt med tydelig funksjon og betydelig innholdsmengde.
- Egne sider for:
  - Om oss (`/info/om-oss`)
  - Personvern (`/info/personvern`)
  - Kontakt (`/info/kontakt-oss`)
- Konsistent design og profesjonell presentasjon.

### Gap/risiko mot godkjenning
1. Innholdspolicy-risiko:
- Flere 18+ spill har seksuelt/flørtende/fysisk innhold som kan trigge policybegrensninger eller avslag for AdSense.

2. Consent/compliance:
- Cookie-banneret er enkelt "aksepter"-banner, uten full CMP-flyt (særlig relevant for EØS/UK-trafikk).

3. Publisist-signaler:
- Mangler tydelig "Terms/Vilkår" side.
- Begrenset tydelighet rundt juridisk publisher-identitet (utover e-postkontakt).

4. Ad-tech readiness:
- Ingen `ads.txt` i `public/`.
- Ingen faktisk AdSense-script/integrasjon ennå (kun placeholder-komponenter).

### Totalvurdering AdSense
- **Teknisk/presentasjon:** god basis.
- **Policy-risiko:** moderat til høy, primært pga. 18+ / seksuelt innhold.
- **Godkjenningssannsynlighet uten tiltak:** usikker.

## Ad placement opportunities

### Naturlige annonseområder (lav UX-friksjon)
1. Forside:
- Etter "Anbefalt nå" eller etter temaseksjonen.

2. Temahuber/artikkelhuber:
- Mellom innholdsblokker i lange tekstseksjoner (f.eks. midt i Fadderuka/Russetiden-artiklene).

3. Drikkelek-innhold:
- Én annonse etter "Slik spiller dere" eller mellom hovedseksjoner.

4. Liste-sider:
- Etter første grid-seksjon, ikke overless toppen.

### Plasseringer som bør unngås
- Midt i aktiv spillflyt på `/spill/*` nær primære handlinger ("Neste kort"/"Spinn flasken") pga. UX-friksjon og risiko for utilsiktede klikk.
- For mange annonser over fold på mobil.
- Sticky/bottom ads som overlapper spillkontroller.

## Technical SEO

### Det som er på plass
- `sitemap.xml` genereres i App Router.
- `robots.txt` finnes og tillater crawling.
- Statisk eksport gir stabile, cache-vennlige URL-er.
- `lang="no"` i HTML.

### Mangler eller svakheter
1. Canonical:
- Ingen canonical på noen sider.

2. Open Graph/Twitter:
- Ingen OG/Twitter metadata.

3. Structured data:
- Ingen JSON-LD (f.eks. `Organization`, `WebSite`, `BreadcrumbList`, `Article`).

4. Heading-struktur:
- 38 av 74 HTML-sider mangler semantisk `<h1>`.
- Særlig rammet: forside, mange spillsider, drikkelek-artikler og info-sider (pga. `CardTitle` som `<div>`).

5. Indexeringskontroll:
- Ingen eksplisitt noindex-strategi for utility-sider med svak søkeintensjon.

6. Multi-host/basePath:
- Ingen canonical-strategi for å styre preferert domene ved parallell hosting (GitHub Pages + Cloudflare/custom domain).

## Strengths
- Solid statisk arkitektur (Next.js App Router + static export).
- Bredt innholdsunivers med tydelige temaklynger.
- Gode title/description-mønstre på dynamiske sider.
- God grunnstruktur for tillit (om oss/personvern/kontakt).
- Klare annonseområder i layout uten å måtte redesigne hele appen.

## Weaknesses
- Manglende canonical/OG/Twitter/structured data.
- Svak internlink-discovery til mange spillsider (forsterket av CSR-bailout på `/alle-spill`).
- Mange sider uten semantisk `<h1>`.
- AdSense-policy-risiko knyttet til voksen/seksuelt innhold.
- Manglende ads.txt og fullverdig consent-løsning.

## Recommendations

Prioritet A (høyest effekt):
- Etabler komplett metadata-standard (canonical + OG + Twitter + metadataBase).
- Sørg for crawlbar server-rendert internlenking til spillsider (spesielt fra `/alle-spill`).
- Legg semantiske `<h1>` på alle viktige SEO-sider.

Prioritet B:
- Innfør structured data for organisasjon, nettsted, artikler og breadcrumbs.
- Definer noindex-regler for utility/flow-sider.
- Stram internlenking med "relaterte spill/relaterte artikler" på tvers.

Prioritet C:
- Øk tekstdybde på tynne katalogsider (musikk/skjerm).
- Styrk publisher-signaler med vilkårsside + tydeligere juridisk info.
- Gjennomfør AdSense-kompatibel consent- og policystrategi.

## Top 10 improvements

1. Innfør canonical + `metadataBase` på alle indekserbare sider.
2. Legg til Open Graph- og Twitter-metadata for deling og SERP-kvalitet.
3. Fjern/omgå CSR-bailout på `/alle-spill` slik at spillkortlenker blir server-renderte `<a>`.
4. Legg semantisk `<h1>` på forside, spillsider, drikkelek-artikler og info-sider.
5. Implementer JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `Article`).
6. Lag en eksplisitt noindex-strategi for utility-sider (`/oppsummering`, `/takk`, evt. `/print/*`, skjulte custom-sider).
7. Etabler internlenke-moduler ("relaterte spill/artikler/temaer") på detaljsider.
8. Definer AdSense-strategi for 18+ innhold (segmentering, blokkering eller separat domene/område) før søknad.
9. Implementer EØS-kompatibel CMP/consent-løsning og consent mode for annonsering/analyse.
10. Legg til `ads.txt`, vilkårsside og tydeligere publisher-identitet for bedre tillitssignaler.

