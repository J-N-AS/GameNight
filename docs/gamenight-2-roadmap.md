# GameNight 2.0 – Produkt- og UX-veikart

Dato: 9. mars 2026  
Status: internt produkt- og UX-dokument

## 1. Executive summary

GameNight er i dag et fungerende produkt med ekte verdi: det er raskt å starte, enkelt å forstå, gratis å bruke og bygget rundt en sosial én-enhets-modell som fungerer godt i vorspiel, studentfester, hytteturer og vennekvelder. Appen har nok innhold til å føles som en plattform, og den tekniske kjernen er allerede sterk nok til å bære videre produktutvikling.

UX/UI-strategirapporten konkluderer samtidig tydelig med at GameNight ikke er sterkt nok som produktopplevelse. De største svakhetene er ikke funksjonelle feil, men manglende produktfokus, for svak kuratering, for lite dramaturgi i spillflyten, for generisk visuell identitet og en desktop/shared-screen-opplevelse som føles som skalert mobil i stedet for en bevisst spillflate.

Hovedretningen for GameNight 2.0 bør derfor være et målrettet produktløft, ikke en full redesign og ikke en systemtung utvidelse. GameNight skal bli den tydelige norske festspillplattformen for én skjerm, med rask oppstart, sterkere gameplay-energi, mer kuratert katalog og en opplevelse som i større grad føles som et faktisk produkt og mindre som en fungerende beta.

## 2. Produktretning

GameNight er:

- en norsk festspillplattform for voksne 18+
- designet for én skjerm i sosiale settinger
- bygget for rask oppstart uten login, konto eller multiplayer-oppsett
- fokusert på morsom gameplay, tydelig spillflyt og lav friksjon
- laget for mobil først, men skal også fungere godt på laptop, delt skjerm og TV

GameNight skal ikke være:

- en komplisert multiplayer-app med synk mellom flere enheter
- et konto- eller abonnementstungt produkt
- en enterprise-preget plattform med adminsystemer og avanserte kontrollflater
- en bred innholdsportal der SEO-, guide- og støtteinnhold får lik prioritet som selve spillopplevelsen

Kjerneproduktet er å hjelpe en gruppe voksne med å åpne GameNight og komme raskt inn i et spill som er lett å forstå, morsomt å kjøre og sosialt å dele.

## 3. Kjerneprodukt vs støtteinnhold

Kjerneproduktet i GameNight skal være denne løkken:

`forside -> spillvalg -> pre-game -> gameplay -> oppsummering`

Dette er reisen som må ha høyest designkvalitet, tydeligst prioritering og mest produktenergi. Når brukeren åpner GameNight, skal det være åpenbart hva som er neste beste handling for å starte noe nå.

Støtteinnhold i GameNight er:

- temasider
- klassiske drikkeleker og regelartikler
- musikkleker og skjermleker
- trust-sider som FAQ, vilkår og changelog
- PWA/install-informasjon
- kampanje- og sesongflater

Støtteinnholdet skal styrke distribusjon, troverdighet og oppdagelse, men det skal ikke konkurrere med kjerneproduktet om førsteprioritet på forside, i katalog eller under aktiv spilling.

## 4. De største UX-problemene i dag

### Forsidehierarki

Forsiden prioriterer ikke raskt nok det brukeren faktisk vil gjøre: starte et spill. Hero, branding, spilleroppsett, `PartyTools`, temaer, donasjon og sekundærinnhold får for lik vekt. Resultatet er at forsiden føles mer som en landingsside enn som en skarp startflate for kveldens spill.

### For lite kuratert spillkatalog

Katalogen har mye innhold, men kvaliteten oppleves ujevn. Svake, overlappende eller halvsterke spill trekker ned totalinntrykket. Når alt er synlig, blir det vanskeligere å forstå hva GameNight faktisk anbefaler, og det blir tregere å velge riktig spill for stemningen.

### Svak dramaturgi i spillflyten

Pre-game, aktiv spilling og avslutning er i dag for like i tone og struktur. Samtykke, modusvalg og instruksjon informerer, men bygger lite forventning. Selve kortflyten fungerer, men mangler tydelig nok rytme, opptrapping og payoff. Det svekker energien og reduserer følelsen av en gjennomført spillopplevelse.

### Generisk visuell identitet

Dagens UI er ryddig, men for template-preget. Det ser mer ut som et generisk kortbasert webprodukt enn som en distinkt norsk festspillplattform. Når uttrykket er for generisk, blir GameNight mindre minneverdig og mindre delbar som produkt.

### Svak desktop- og shared-screen-opplevelse

Desktop fungerer teknisk, men føles som skalert mobil. Spillet tar ikke nok plass, typografien er for forsiktig, og perifert UI kommer for tett på gameplay. Ved skjermdeling eller TV-bruk blir resultatet mer “nettside i fullskjerm” enn “spillet alle ser på”.

### Repetitiv kortdesign

Kortene har noe differensiering, men mange oppleves fortsatt som stor tekst i en boks. Når ulike korttyper, stemninger og intensiteter får for lik presentasjon, mister gameplay rytme, variasjon og karakter.

### Svak payoff i avslutningen

Oppsummeringen har sosial verdi, men føles mer som et sideverktøy enn som en finale. Når avslutningen ikke har nok troverdighet eller dramatisk tyngde, mister GameNight noe av gjenbruksverdien som kunne kommet fra en sterk “la oss ta én runde til”-effekt.

## 5. Overordnet utviklingsstrategi

GameNight 2.0 bør utvikles som et fasevis produktløft. Målet er ikke å redesigne alt samtidig, og heller ikke å bygge store nye systemer. Målet er å forbedre de mest verdifulle delene av brukerreisen i riktig rekkefølge.

Strategien bør være:

- start med produktfokus og kuratering før visuell pynt
- løft gameplay-opplevelsen før bredere merkevarearbeid
- forbedre desktop/shared-screen som en del av kjernen, ikke som et sideprosjekt
- bygg videre på dagens statisk-first-arkitektur og én-enhets-prinsipp
- bruk eksisterende strukturer som `recommendedGames`, skjulte spill, temaer og oppsummeringsflyt som grunnlag for bedre prioritering, ikke for større systemutvidelser

## 6. Fase 1 – Produktfokus og kuratering

Mål: gjøre GameNight tydeligere som produkt og raskere å starte.

Konkrete oppgaver:

- tone ned toppseksjon og branding nok til at faktiske spillvalg kommer høyere opp på forsiden
- bygge forsiden rundt “start noe nå” som første prioritet
- løfte anbefalte spill og raske startere lenger opp enn spilleradministrasjon og støtteinnhold
- bruke eksisterende `recommendedGames` som tydelig redaksjonell hurtigstartflate
- flytte `PartyTools`, donasjon og andre sekundærflater lenger ned i hierarkiet
- redusere visuell vekt på temaer og støttekategorier på forsiden
- rydde `Alle spill` slik at brukeren ser resultater raskere og slipper for mye tematisk navigasjon før selve katalogen
- etablere en klarere toppgruppe av spill som er “beste førstegangsvalg”, “best på vors”, “best for stor gruppe” og tilsvarende enkle innganger
- skjule, nedgradere eller flytte svakere og mer eksperimentelle spill bort fra hovedflater ved hjelp av eksisterende synlighetsmekanismer som skjulte spill og lavere katalogvekt
- fjerne eller redusere overlapp der flere spill fyller nesten samme rolle uten å være tydelig forskjellige i kvalitet eller stemning

Effektmål for fasen:

- raskere vei til første spill
- tydeligere forståelse av hva GameNight anbefaler
- høyere opplevd kvalitet i katalogen uten å bygge nye backend-systemer

## 7. Fase 2 – Gameplay-opplevelse

Mål: gjøre selve spilløkten mer energisk, tydelig og minneverdig.

Konkrete oppgaver:

- redesigne pre-game-stegene slik at samtykke, modusvalg og instruksjon føles som oppstart av en spillopplevelse, ikke bare informasjonskort
- gjøre overgangene tydeligere mellom pre-game, aktiv spilling og avslutning
- etablere et klarere fokusmodus-prinsipp under aktiv spilling, der kortet og handlingen får mest mulig autoritet
- redusere konkurrerende UI rundt gameplay, særlig relatert innhold, annonseelementer og nettsidekontekst
- utvikle tydeligere kortmønstre per type og intensitet, slik at rolig prompt, pekelek, bekjennelse, duell, regelkort og straff oppleves forskjellig
- gi langvarige regelkort eller rundeeffekter enklere vedvarende UI-støtte, slik at de ikke forsvinner idet neste kort vises
- styrke overgangene mellom kort med mer bevisst rytme, timing og visuell energi
- redesigne post-game og oppsummering slik at avslutningen føles mer som finale enn som et sideverktøy
- gjøre oppsummeringen tydeligere som sosial payoff og gjenbruksdriver, samtidig som tonen blir mer ærlig om hva som faktisk spores

Effektmål for fasen:

- mer dramatisk og tydelig spillflyt
- høyere energi under spill
- sterkere sluttfølelse og større sjanse for at gruppen starter et nytt spill

## 8. Fase 3 – UX polish

Mål: stramme opp opplevelsen på mobil og gjøre desktop/shared-screen merkbart bedre uten å bygge egen TV-mode.

Konkrete oppgaver:

- redusere unødvendig høydeforbruk og scrollefriksjon på mobil, særlig i forside og katalog
- forbedre spacing og rytme mellom seksjoner slik at kjernehandlinger alltid kommer raskere fram
- gjøre typografi, kortstørrelse og kontrast tydeligere på større skjermer
- gi spillflaten mer bredde og autoritet på desktop slik at selve spillet dominerer skjermen
- redusere perifer UI under spilling, inkludert footer-følelse, nærliggende sekundærinnhold og små detaljer som leses som nettsidekrom
- forbedre TV-vennlighet gjennom større tekst, enklere komposisjon og færre distraksjoner
- sikre at kort og CTA-er er lesbare på avstand uten at mobilopplevelsen blir tyngre
- gjøre info- og temasider mindre teksttunge i toppen slik at handling kommer tidligere

Effektmål for fasen:

- mer stram mobilopplevelse
- bedre lesbarhet på delt skjerm
- mindre gap mellom mobilbruk og felles skjermbruk

## 9. Fase 4 – Brand og theming

Mål: gi GameNight et tydeligere visuelt særpreg uten å gjøre arkitekturen tung eller skjør.

Konkrete oppgaver:

- definere et lite, tydelig brand-system med semantiske design tokens for farge, typografi, overflater, kontrast og bevegelse
- erstatte hardkodede stilvalg i sentrale flater med tokens og komponentvarianter som uttrykker stemning mer bevisst
- etablere et enkelt mood-system for spill med nivåene `rolig`, `party`, `kaos`, `flørt`, `spicy` og `sesong`
- la mood påvirke bakgrunn, badge-stil, korttoner, CTA-accenter og enkel mikroanimasjon
- definere sesongoverlays for halloween, jul, 17. mai, kvinnedagen og russetid
- holde de fleste sesongendringer subtile, og kun bruke tydeligere takeovers på de største og mest naturlige sesongene
- bruke logo-varianter, toppseksjons-accenter, badge-accenter og enkle asset-slots i stedet for å lage egne designgrener for hver sesong

Theming skal implementeres som token- og asset-overrides med en enkel sesongmanifest-tankegang. Det skal ikke løses med egne komponentgrener, separate UI-systemer eller komplisert runtime-arkitektur. Målet er en lettvektsmodell som passer dagens statisk-first-arkitektur og gjør sesongtilpasning mulig uten stor vedlikeholdskostnad.

Effektmål for fasen:

- sterkere produktpersonlighet
- tydeligere kobling mellom tone, spilltype og visuell presentasjon
- enklere sesongarbeid uten teknisk kompleksitet

## 10. Spillbibliotekstrategi

GameNight bør gå fra “mye innhold synlig” til “riktig innhold synlig”. Biblioteket skal fortsatt være bredt nok til å føles rikt, men hovedopplevelsen skal preges av kvalitet, tydelig kuratering og raskere valg.

Strategiske grep:

- prioriter kvalitet og anbefalinger over ren katalogbredde
- bygg en tydelig toppliste av spill som GameNight faktisk vil sende folk inn i først
- bruk eksisterende `recommendedGames` som startpunkt for en mer offensiv kuratering
- del spill tydeligere inn etter brukssituasjon, energi og gruppetype, ikke bare etter brede tags
- senk synligheten til eksperimentelle, overlappende eller svakere spill uten å måtte slette alt med en gang
- bruk temaer som støtte for oppdagelse og kontekst, men ikke som primær inngang for førstegangsbrukere
- sørg for at hovedkatalogen viser spill raskt og at filtrering føles som hjelp, ikke som en barriere
- vurder katalogen redaksjonelt med jevne mellomrom, ikke bare som en voksende liste

Bibliotekstrategien for GameNight 2.0 er derfor mindre fokus på kvantitet og mer fokus på gjennomsnittskvalitet, tydelig anbefaling og høyere treffrate når brukeren skal velge spill.

## 11. UX-prinsipper for GameNight

GameNight UX skal være:

- rask: brukeren skal komme til spill på få sekunder
- sosial: UI skal støtte gruppedynamikk, ikke stjele fokus fra den
- tydelig: det skal alltid være klart hva neste steg er
- energisk: opplevelsen skal ha rytme, intensitet og payoff
- kuratert: GameNight skal vise smak og prioritering, ikke bare alt samtidig
- lav friksjon: ingen unødvendige steg, valg eller barrierer
- mobil-lesbar: alt viktig skal fungere godt på håndholdt skjerm
- TV-lesbar: gameplay skal også kunne leses på avstand ved skjermdeling
- trygg: samtykke, tone og voksenprofil skal være tydelig uten å bli moraliserende

## 12. Roadmap prioritering

De 10 viktigste UX/UI-oppgavene, prioritert etter effekt:

1. Rebygge forsiden rundt “start noe nå” og få faktiske spillvalg høyere opp enn branding og støtteinnhold.
2. Gjøre `recommendedGames` til en sterk, tydelig hurtigstartflate med få, gode førstevalg.
3. Rydde hardt i katalogsynlighet og senke vekten på svake, overlappende og halvsterke spill.
4. Gjøre `Alle spill` mindre topptung og få faktiske resultater raskere fram enn temachips og filterlag.
5. Redesign av pre-game-stegene slik at samtykke, modusvalg og instruksjon bygger forventning og energi.
6. Innføre et tydelig fokusmodus-prinsipp under aktiv spilling med mindre konkurrerende UI og større spillflate.
7. Utvide kortdesign fra én mal til tydelige mønstre per korttype, intensitet og spillrolle.
8. Løfte desktop/shared-screen med større typografi, bredere kort og mindre nettsidefølelse.
9. Redesign av oppsummering/post-game slik at den føles som payoff og gjenbruksdriver, ikke bare som ekstrafunksjon.
10. Definere et semantisk brand- og theming-system som kan bære mood og sesong uten stor teknisk kompleksitet.

## 13. Hva vi IKKE bør gjøre

GameNight 2.0 bør ikke bruke tid på initiativer som bryter med produktets styrke som enkel, rask og sosial én-skjerm-opplevelse.

Vi bør ikke:

- bygge komplisert multiplayer eller sanntids-synk mellom flere enheter
- lage konto-system, profiler eller innlogging som øker friksjonen
- bygge enterprise- eller admin-tunge funksjoner som ikke forbedrer selve spillerreisen
- gjøre appen mer kompleks for å støtte sjeldne edge cases
- prioritere backend-avhengige features som ikke gir tydelig UX-verdi i kjerneproduktet
- la SEO-, donasjons- eller støtteflater dominere over spillstart og gameplay
- satse på full redesign av alt samtidig
- introdusere et tungt theming-system med egne komponentgrener eller komplisert runtime-logikk

GameNight skal fortsatt være enkel å åpne, enkel å forstå og rask å bruke. GameNight 2.0 handler om å gjøre kjerneopplevelsen sterkere, ikke om å gjøre produktet større for sin egen del.
