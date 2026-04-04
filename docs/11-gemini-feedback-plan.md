# Faseplan: gameplay, UX og vekst

Sist oppdatert: 2026-04-04

Dette dokumentet konkretiserer Gemini-feedbacken til en faseinndelt plan som passer dagens GameNight-arkitektur. Planen supplerer `docs/09-roadmap.md` og holder fast på tre produktprinsipper:

- én skjerm er normaltilfellet
- gameplay skal være raskt å forstå
- drift og publisering skal være så enkle som mulig

## Mål

- gjøre kortene mer interaktive uten å gjøre spillflyten tyngre
- forbedre shared-screen- og TV-opplevelsen
- styrke deling og SEO uten å miste den statiske driftsmodellen
- redusere UX-friksjon fra annonser og analytics

## Viktige premisser

- GameNight er fortsatt et én-skjerm-produkt, ikke et multi-device-system
- nytt gameplay-UI må være valgfritt eller kontekstuelt, ikke permanent støy
- repoet er rigget for statisk eksport via `next.config.ts` og `docs/10-cloudflare-pages-setup.md`
- `vorspiel-mix.json` har allerede timer-felt i arbeidskopien, men `GameTask`, editoren og gameplay-UI støtter det ikke formelt ennå
- klassiske drikkeleker lever i en egen artikkelmodell (`drikkeleker.json`) og må utvides uten å svekke dagens SEO-tekstflater

## Fase 1: Stabilisering og rammevalg

Mål:

- ta de tryggeste gevinstene først
- avklare tekniske retninger før flere dataendringer rulles ut

Leveranser:

- reservere plass rundt `AdBanner` på info- og artikkelsider for å redusere layout shift
- dokumentere nye felter for spillkort og artikler før flere JSON-filer endres
- velge retning for analytics: midlertidig beholde GA eller planlegge overgang til Cloudflare Web Analytics
- velge retning for OG-bilder: build-genererte assets først, eller senere runtime-basert løsning

Teknisk berøringsflate:

- `src/components/info/InfoPageClient.tsx`
- `src/components/drikkeleker/DrikkelekerClient.tsx`
- `src/lib/types.ts`
- `src/lib/game-editor.ts`
- `src/components/common/ConsentManagedGoogleScripts.tsx`
- `docs/10-cloudflare-pages-setup.md`

Ferdig når:

- annonseplassering ikke gir tydelig hopping når siden laster
- nye metadatafelter er eksplisitt definert før større innholdsarbeid
- teamet har tatt et bevisst valg om OG-strategi og analytics-retning

## Fase 2: Timere og smartere kort

Mål:

- gjøre tidsbaserte kort faktisk spillbare uten manuell nedtelling
- løfte interaktiviteten uten å introdusere tung spilladministrasjon

Leveranser:

- utvide `GameTask` med støtte for `timer` og eventuelt et enkelt straffefelt som kan brukes videre senere
- oppdatere zod-schema, editor og sanitizing slik at timer blir førsteklasses spilldata
- lage en stor, tydelig timer-komponent i gameplay med start, restart og ferdig-state
- koble timer til utvalgte kort først, med `vorspiel-mix` som pilotdeck
- sikre at kort uten timer ser identiske ut med dagens opplevelse

Teknisk berøringsflate:

- `src/lib/types.ts`
- `src/lib/game-editor.ts`
- `src/lib/games.ts`
- `src/components/game/GameClient.tsx`
- `src/components/game/TaskCard.tsx`
- relevante `src/data/*.json`

Ferdig når:

- tidskort kan spilles uten at gruppen teller selv
- timer-funksjonen ikke skaper ekstra friksjon på vanlige kort
- dataflyten fungerer likt i JSON, editor og frontend

## Fase 3: Deling og SEO-flate

Mål:

- øke klikkrate når spill og temaer deles i meldinger og sosiale flater
- gjøre metadata mer spesifikke per side enn dagens felles standardbilde

Leveranser:

- innføre spill- og temaspesifikke Open Graph-bilder med tittel, emoji og tydelig GameNight-branding
- etablere en mal for hvordan spill, temaer og artikler mapper data til delingsbilder
- oppdatere `src/lib/seo.ts` slik at sider kan bruke egne OG-assets i stedet for kun standardlogo
- validere deling for sentrale sider som `Ring of Fire`, `Singelkveld` og `vorspiel-mix`

Teknisk avklaring:

- fordi repoet er rigget for statisk eksport, bør første versjon baseres på forhåndsgenererte eller build-genererte bilder
- `@vercel/og` eller annen runtime-generering bør først vurderes hvis produktet bevisst går bort fra ren statisk drift

Teknisk berøringsflate:

- `src/lib/seo.ts`
- metadata i spill-, tema- og artikkelsider
- eventuelt en build-prosess for OG-assets

Ferdig når:

- kjerneflater har unike delingsbilder
- nye sider kan få korrekt OG-bilde uten manuell spesialbehandling
- løsningen er kompatibel med statisk eksport

## Fase 4: TV-modus og party-faktor

Mål:

- gjøre GameNight tydeligere og mer levende på delt skjerm
- forbedre stuebruk uten å gå bort fra én-mobil-flyten

Leveranser:

- justere `TaskCard` for brede skjermer med sterkere skalering av typografi og spacing
- teste gameplay eksplisitt i landscape, desktop og castet TV-visning
- legge til valgfrie lydeffekter for nytt kort, impact-kort og ferdig timer
- samle lyd og eventuelle visningsvalg i en enkel innstillingsmodell, ikke i et tungt kontrollpanel

Teknisk berøringsflate:

- `src/components/game/TaskCard.tsx`
- `src/components/game/GameClient.tsx`
- `src/lib/gameplay.ts`
- eventuelle nye klient-hooks for lyd og UI-preferanser

Ferdig når:

- kortteksten fyller store flater bedre enn i dag
- lyd er opt-in og krever ikke tunge biblioteker
- gameplay oppleves like ryddig på mobil som på TV

## Fase 5: Rikere innhold og intensitetsstyring

Mål:

- bruke metadata mer aktivt både i spill og i klassiske drikkeleker
- gjøre innholdet smartere uten å miste redaksjonell enkelhet

Leveranser:

- utvide `drikkeleker.json` med felt som `intensity`, `players` og `tags`
- legge til filtrering for klassiske drikkeleker basert på gruppestørrelse og intensitet
- utforske et enkelt `sip_amount`- eller `penalty`-felt som kan skaleres av en intensitetsvelger før spillstart
- holde standardopplevelsen enkel: hvis brukeren ikke velger nivå, brukes normale korttekster og defaults

Teknisk berøringsflate:

- `src/lib/types.ts`
- `src/lib/articles.ts`
- `src/components/drikkeleker/DrikkelekerClient.tsx`
- spillstartflyt og eventuelle innstillinger før spill

Ferdig når:

- klassiske drikkeleker kan filtreres uten å miste SEO-verdi
- intensitetsstyring er forståelig for brukeren på få sekunder
- datamodellen åpner for dynamiske straffer uten at hele spillmotoren må bygges om

## Fase 6: Privacy-friendly analytics og trust

Mål:

- styrke produktløftet om lav profilering
- redusere consent-friksjon der det er mulig

Leveranser:

- erstatte Google Analytics med Cloudflare Web Analytics hvis innsiktsbehovet dekkes
- oppdatere personvern-, info- og eventuell cookie-copy slik at budskapet matcher faktisk oppsett
- forenkle script-lasting hvis analytics ikke lenger trenger cookies eller lokal consent-gating
- verifisere at annonser fortsatt håndteres separat fra analytics

Teknisk berøringsflate:

- `src/components/common/ConsentManagedGoogleScripts.tsx`
- `src/lib/consent.ts`
- relevante infosider og policy-sider
- `docs/10-cloudflare-pages-setup.md`

Ferdig når:

- analytics ikke lenger er i konflikt med produktets personvernposisjon
- consent-flaten er så liten som mulig
- dokumentasjonen stemmer med faktisk drift

## Anbefalt rekkefølge

1. Fase 1 fordi den gir raske kvalitetsforbedringer og avklarer retning før mer arbeid starter.
2. Fase 2 fordi timer er den tydeligste gameplay-gevinsten og bygger direkte på eksisterende kortdata.
3. Fase 3 fordi delingsbilder kan gi veksteffekt uten å forstyrre aktiv spilling.
4. Fase 4 fordi TV-modus og lyd løfter opplevelsen når gameplay-grunnmuren er på plass.
5. Fase 5 fordi rikere metadata og dynamisk intensitet er verdifulle, men litt mer produktmessig komplekse.
6. Fase 6 fordi analytics-migrering bør gjøres bevisst, med tydelig målbilde og oppdatert dokumentasjon.

## Bevisst ikke del av denne planen

- kontoer, profiler eller innlogging
- multiplayer mellom flere enheter
- større omskriving av spillmotoren
- tung regeladministrasjon midt i gameplay
- overgang til SSR eller serverruntime kun for å få én enkel feature
