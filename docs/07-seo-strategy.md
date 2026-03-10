# SEO strategy

## Formål

SEO i GameNight skal støtte produktet, ikke erstatte det. Innholdssider og temahuber skal føre brukere inn i spillbiblioteket og bygge tillit rundt produktet.

## Innholdsarkitektur

GameNight har fire hovedtyper SEO-relevante sider:

### Spill

- rute: `/spill/[gameId]`
- kilde: `src/data/*.json`
- funksjon: indeksérbare spillsider med relaterte spill og temaer

### Temaer

- rute: `/tema/[slug]`
- kilde: `src/data/themes.json`
- funksjon: kuraterte landingssider for ulike kvelder og stemninger

### Huber

- ruter: `/fadderuka`, `/russetiden`, `/musikkleker`, `/skjermleker`
- funksjon: bredere innholdsklynger og kampanje-/situasjonsflater

### Artikler

- ruter: `/drikkeleker` og `/drikkeleker/[slug]`
- kilde: `src/data/drikkeleker.json`
- funksjon: klassiske regler, forklaringer og søkbar how-to-intensjon

## Teknisk SEO

Felles metadata bygges gjennom `src/lib/seo.ts`.

Det inkluderer:

- canonical
- Open Graph
- Twitter card
- `metadataBase`
- breadcrumb JSON-LD

I tillegg brukes:

- `Organization` JSON-LD i layout
- `WebSite` JSON-LD i layout
- `Article` JSON-LD på drikkelek-artikler
- `FAQPage` JSON-LD på `/faq`

## Indexeringsregler

Noen sider skal ikke konkurrere i søk:

- `/oppsummering`
- `/takk`
- `/print/mingle-bingo`
- skjulte spill (`hidden` eller `isHiddenFromMain`)

Disse får `noindex` i metadata.

## Sitemap og robots

- `src/app/sitemap.ts` bygger sitemap fra spill, temaer og artikler
- `src/app/robots.ts` peker til korrekt sitemap

`NEXT_PUBLIC_CANONICAL_ORIGIN` bør settes i produksjon når endelig domene er klart.

## Hvordan lage en ny temaside

1. legg en ny oppføring i `src/data/themes.json`
2. sett `slug`, `title`, `metaDescription`, `emoji`, `content` og `gameIds`
3. sørg for at alle `gameIds` finnes i `src/lib/games.ts`
4. vurder om temaet også bør lenkes fra forsiden eller andre huber

Temasidene prerenderes automatisk via `generateStaticParams`.

## Hvordan lage en ny drikkelek-artikkel

1. legg artikkelen i `src/data/drikkeleker.json`
2. legg eventuelt bildeoppslag i `src/lib/placeholder-images.json`
3. verifiser at artikkelen har tydelig beskrivelse, utstyr, regler og eventuelle varianter
4. test at siden får riktig metadata og relaterte lenker

Artikkelsidene prerenderes automatisk og får `Article` JSON-LD.

## Hvordan få et nytt spill inn i SEO-flaten

Et nytt spill blir teknisk tilgjengelig så snart det ligger i `src/lib/games.ts`, men det blir ikke nødvendigvis en god SEO-side automatisk.

Vurder dette:

- spillet må ikke være skjult hvis det skal indekseres
- det bør ha tydelig `title` og `description`
- det bør kobles til relevante temaer
- det bør passe inn i biblioteket og relaterte lenker

## Publisher-readiness

Dagens grunnmur er på plass:

- canonical/OG/Twitter
- JSON-LD
- sitemap og robots
- trust-sider
- `ads.txt` placeholder

Det som fortsatt er operativt arbeid, ikke kodearkitektur:

- sette korrekt canonical-origin
- fylle inn ekte `ads.txt`-record ved behov
- vurdere policy-risiko rundt 18+-innhold
- sikre at eventuell consent-løsning møter krav i målmarkedet
