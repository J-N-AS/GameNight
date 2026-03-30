# Cloudflare Pages-oppsett

Sist oppdatert: 2026-03-30

Dette dokumentet beskriver alt som må settes manuelt i Cloudflare for GameNight, og som ikke kan løses kun ved å endre kode i repoet.

Målet er:

- billigst mulig drift
- statisk hosting på Cloudflare Pages
- minst mulig risiko for deploy-feil
- én tydelig produksjons-URL: `https://gamenight.no`

## Anbefalt modell for GameNight

GameNight bør kjøres som ren statisk eksport på Cloudflare Pages.

Det betyr:

- ingen Pages Functions
- ingen SSR
- ingen OpenNext
- ingen `@opennextjs/cloudflare`
- ingen egen `wrangler.toml` for produksjonsdeploy

Repoet er allerede rigget for dette med:

- `npm run build:cloudflare`
- output-mappen `out`
- statiske headers i `public/_headers`

## 1. Pages-prosjekt

Hvis prosjektet allerede finnes i Cloudflare Pages, gå til prosjektet og oppdater innstillingene i stedet for å lage et nytt.

Anbefalte innstillinger:

- Production branch: `main`
- Root directory: tom / default
- Build command: `npm run build:cloudflare`
- Build output directory: `out`
- Node.js version: `20`

Hvis Cloudflare-wizarden har satt et standard Next.js-oppsett som peker mot `.vercel/output/static` eller noe OpenNext-relatert, skal det byttes ut. For dette repoet er `out` riktig output.

## 2. Miljøvariabler i Pages

Sett disse for production:

- `NODE_VERSION=20`
- `NEXT_PUBLIC_SITE_URL=https://gamenight.no`
- `NEXT_PUBLIC_CANONICAL_ORIGIN=https://gamenight.no`

Sett denne bare hvis dere faktisk bruker ekstern donasjonsløsning i produksjon:

- `NEXT_PUBLIC_DONATION_API_URL=<produksjons-endpoint>`

Dette skal normalt ikke settes i produksjon på custom domain:

- `NEXT_PUBLIC_BASE_PATH`

La den være tom eller helt unset. Base path trengs for repo-hosting, ikke for `gamenight.no` på rotdomenet.

## 3. Brancher og builds

For billigst mulig drift bør dere være bevisste på hvor mange builds Pages kjører.

Anbefalt oppsett:

- Production branch: `main`
- Preview branches: slå av hvis dere ikke aktivt bruker preview-deployer

Hvis dere vil ha previews, bruk heller en liten allowlist enn "alle brancher".

Cloudflare Pages Free har en grense på 500 builds per måned. For dette prosjektet er det sjelden byggtid eller lagring som blir problemet; det er oftere unødige preview-builds.

## 4. Build watch paths

Gå til prosjektet i Cloudflare og sett Build watch paths slik at dokumentasjonsendringer ikke trigger nye deploys.

Anbefalt oppsett:

- Include paths: `*`
- Exclude paths: `docs/*,README.md,SPILL_OVERSIKT.md,public/README.md,.github/*`

Dette gjør at innholdsendringer i appen fortsatt bygger, mens dokumentasjon og GitHub workflow-endringer ikke bruker opp build-kvoten.

Vurder å være mer konservativ hvis dere senere legger flere ikke-produksjonsfiler i repoet.

## 5. Build cache

Build cache bør være på.

Cloudflare Pages kan cache ting som:

- npm-cache
- Next sin build-cache

Det er nyttig for å gjøre gjentatte deploys billigere og raskere.

Dette er noe annet enn caching av selve nettstedet ute på domenet.

## 6. Caching på domenet

Ikke legg inn egne Cache Rules på `gamenight.no` i første omgang.

For denne typen statisk Pages-prosjekt er anbefalingen:

- bruk Pages sine standarder
- la `_headers` i repoet styre browser-cache der vi trenger det
- ikke overstyr med aggressive custom cache-regler på sonenivå

Årsaken er at egne cache-regler på custom domain lettere kan gi stale innhold etter deploy.

Det dere allerede har fra repoet:

- caching for hashed `_next/static`-assets
- fornuftige cache-regler for manifest, service worker og ikoner
- noen grunnleggende sikkerhetsheadere

## 7. Custom domain

Når `gamenight.no` ligger i samme Cloudflare-konto som Pages-prosjektet:

1. Gå til Pages-prosjektet.
2. Åpne Custom domains.
3. Legg til `gamenight.no`.
4. Legg til `www.gamenight.no`.
5. La Cloudflare håndtere DNS-oppsettet gjennom Pages-flyten.

Anbefalt canonical host:

- `gamenight.no`

Anbefalt redirect:

- `www.gamenight.no` -> `https://gamenight.no`

Når custom domain fungerer, bør dere også slå på redirect fra `*.pages.dev` til custom domain for å unngå duplisert SEO-surface.

## 8. DNS og SSL

Når domenet er flyttet til Cloudflare og Pages har tatt over custom domain-oppsettet:

- sjekk at både `gamenight.no` og `www.gamenight.no` er grønne og aktive i Pages
- sjekk at sertifikat er utstedt
- sjekk at `https://gamenight.no` svarer uten advarsler

Hvis dere ser både fungerende `pages.dev`-URL og custom domain samtidig uten redirect, bør det ryddes opp før indeksering får løpe lenge.

## 9. Etter første deploy

Sjekk dette manuelt:

- `https://gamenight.no` laster riktig
- `https://www.gamenight.no` redirecter til apex
- gammel `*.pages.dev` redirecter til custom domain
- `https://gamenight.no/robots.txt` virker
- `https://gamenight.no/sitemap.xml` virker
- favicon, manifest og service worker lastes uten 404
- ingen `basePath` er synlig i URL-er

## 10. Ting dere ikke trenger å slå på nå

Dette er ikke nødvendig for første stabile produksjonsoppsett:

- Pages Functions
- OpenNext
- Wrangler-basert deploy
- custom Cache Rules for HTML
- ekstra DNS-triks utover det Pages setter opp
- store framework-endringer i Cloudflare

Hold oppsettet enkelt først. For dette prosjektet er enkelhet direkte knyttet til lavere kostnad og færre feil.

## 11. Senere optimaliseringer

Dette er nyttig senere, men ikke nødvendig før launch:

- Cloudflare Web Analytics
- redirect-regler utover `www -> apex`
- bildekomprimering i repoet for de største artikkelbildene
- strammere preview-strategi hvis mange brancher begynner å deploye

## Kort sjekkliste

Bruk denne listen når dere faktisk sitter i Cloudflare-dashboardet:

- sett build command til `npm run build:cloudflare`
- sett output directory til `out`
- sett `NODE_VERSION=20`
- sett `NEXT_PUBLIC_SITE_URL=https://gamenight.no`
- sett `NEXT_PUBLIC_CANONICAL_ORIGIN=https://gamenight.no`
- ikke sett `NEXT_PUBLIC_BASE_PATH`
- slå på build cache
- begrens preview-branches
- legg inn build watch path-excludes
- legg til `gamenight.no`
- legg til `www.gamenight.no`
- redirect `www` til apex
- redirect `pages.dev` til custom domain

## Referanser

- Cloudflare Pages build watch paths: <https://developers.cloudflare.com/pages/configuration/build-watch-paths/>
- Cloudflare Pages headers: <https://developers.cloudflare.com/pages/configuration/headers/>
- Cloudflare Pages serving and caching behavior: <https://developers.cloudflare.com/pages/configuration/serving-pages/>
- Cloudflare Pages limits: <https://developers.cloudflare.com/pages/platform/limits/>
