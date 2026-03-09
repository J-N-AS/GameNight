# GameNight – UX/UI Strategy Review

Dato: 9. mars 2026  
Repo: `/Users/naleyjanhelge/DEV/GameNight`

## Executive summary
GameNight har et ekte produktgrunnlag, men dagens UX/UI er ikke sterk nok hvis målet er å fremstå som en tydelig, moden og minneverdig norsk festspillplattform.

Kjernen fungerer:
- det er lett å starte noe
- én-enhets-premisset er forståelig
- det finnes mye innhold
- gameplay flyter teknisk bedre enn mange tilsvarende hobbyprodukter

Men opplevelsen som helhet føles fortsatt mer som en fungerende beta enn som et skarpt ferdig produkt. Den største svakheten er ikke at UI-en er ødelagt. Den største svakheten er at den er for forsiktig, for template-preget og for lite prioritert rundt det viktigste: å få folk raskt inn i en tydelig, energisk og sosial spillopplevelse.

Min ærlige vurdering:
- GameNight er brukbart i dag
- GameNight er ikke UX/UI-messig godt nok ennå
- det trengs mer enn små polish-justeringer
- det trengs ikke full rewrite eller enterprise-kompleksitet
- det trengs et merkbart produktløft, særlig i `forside -> valg av spill -> oppstart -> kortflyt -> payoff`

Kort sagt: GameNight har god funksjonell verdi, men mangler fortsatt den produktmessige skarpheten, dramaturgien og visuelle selvtilliten som gjør at folk opplever det som “dette vil jeg faktisk bruke igjen”, ikke bare “dette funker”.

## Grunnlag og metode
Denne vurderingen er basert på:
- dokumentene i `docs/`
- faktisk kode i appen
- ruter, komponenter og spilldata
- lokal rendering av sentrale sider og spillflater i desktop- og mobil-viewports

Gjennomgått spesielt:
- forside
- alle spill
- temasider
- spillsider og game shell
- spilleroppsett
- oppsummering
- infosider / trust-sider
- PWA/install/cookie-flows
- mobil og desktop/shared-screen

## Overordnet vurdering
### Nåværende UX/UI-status
Som fungerende beta: god.  
Som ferdig produktopplevelse: ikke god nok.

### Kort dom
- Enkel nok: delvis ja
- Tydelig nok: delvis ja
- Spennende nok: nei, ikke konsekvent
- “Party” nok: i innholdet ja, i UI-en nei
- Visuelt særpreget nok: nei
- Føles det som et faktisk produkt: delvis
- Føles det også som en funksjonell prototype: ja

### Min konklusjon
Retningen er ikke feil, men den er for svak. GameNight trenger ikke først og fremst flere features. Produktet trenger tydeligere fokus, hardere kuratering og en mer bevisst UX/UI-retning.

## Hva som fungerer bra i dagens UX/UI
- Produktpremisset er lett å forstå: én mobil styrer, resten spiller sammen.
- Det er lav friksjon for å komme i gang: ingen konto, ingen onboarding-tvang, ingen multiplayer-oppsett.
- Mobilvennlige knapper og generelt trygg touch-target-størrelse er på plass i de fleste hovedflater.
- Spilleroppsett er funksjonelt ryddig og nokså lett å forstå.
- Korttyper har fått en viss visuell differensiering, særlig i `TaskCard`.
- Oppsummering er en smart sosial idé med ekte delingspotensial.
- PWA-prompten er relativt forsiktig og ikke aggressiv.
- Trust-sider, FAQ og personvern gjør produktet mer troverdig enn en ren “random party site”.
- Det finnes nok innhold til at produktet føles som en plattform, ikke bare et enkelt spill.

## Hva som bare er “ok”
- Mørk bakgrunn, rød primærfarge og glassmorphism/kort fungerer teknisk, men føles generisk.
- Forsiden er ryddig nok, men ikke skarp nok i prioritering.
- All-games-filtering fungerer, men oppleves tung og topptung.
- Mode/consent/instruction-skjermer fungerer, men er generiske og emosjonelt flate.
- Infosider fungerer som innhold, men ikke som bevisst merkevareopplevelse.
- Desktop fungerer, men utnytter ikke større skjermer særlig godt.

## Hva som føles svakt, uferdig eller prototype-preget
- Visuell identitet er for svak i forhold til produktløftet.
- Forsiden viser ikke raskt nok selve spillproduktet.
- Spillsidene mangler nok “seremoni”, energi og payoff.
- Mye av UI-en føles som samme kortoppskrift brukt overalt.
- Katalogen er for lite kuratert, og svake/dupliserte spill trekker totalopplevelsen ned.
- In-game-visningen blandes med ad-plassholder og SEO-relaterte lister på en måte som svekker følelsen av “nå spiller vi”.
- Desktop/shared-screen føles mer som skalert mobil enn som en bevisst presentasjonsflate.
- Trust-/info-sider og themes er for teksttunge og for like resten av systemet.
- Placeholder “ANNONSE”-bokser får produktet til å se halvferdig ut.

## Hvor store endringer trengs
Jeg mener GameNight trenger større UX/UI-grep enn bare småjusteringer.

Det betyr ikke full redesign av alt. Det betyr:
- merkbar omprioritering av forside og informasjonsarkitektur
- tydeligere kuratering av hva GameNight egentlig er
- mer immersiv game shell
- sterkere visuell identitet
- bedre dramaturgi i spillflyten

Det er altså et produktløft, ikke en total ny app.

## Analyse av forsiden
Forsiden er i dag funksjonell, men ikke optimal som produktfront.

### Det som fungerer
- Hero-copy forklarer produktet greit.
- Primær-CTA-ene er forståelige.
- Spillere kan settes opp raskt.
- Hjemmesiden samler mye funksjonalitet på ett sted.

### Det som er problemet
- Logoen og heroen tar for stor plass i forhold til hva brukeren faktisk vil gjøre.
- Over fold på mobil og desktop vises for lite av selve spillutvalget.
- Når spillere er lagt til, blir spilleradministrasjon løftet høyere enn spillvalg.
- `PartyTools`, donasjon og andre sekundærflater kommer for tidlig i prioritet.
- “Anbefalt nå” kommer for langt ned til å være ekte quick-start.

### UX-konsekvens
Forsiden føles mer som en generell landingsside enn som en skarp “start kveldens spill nå”-flate.

### Min vurdering
Forsiden bør ombygges rundt dette hierarkiet:
1. Start noe nå
2. Velg riktig spill for stemningen
3. Legg til spillere ved behov
4. Utforsk resten av universet

I dag er disse lagene for likestilte.

## Vurdering av informasjonsarkitektur og produktfokus
GameNight fremstår i dag som litt for mange ting samtidig:
- digital spillapp
- samleside for klassiske drikkeleker
- temaside-/SEO-hub
- verktøykasse
- donasjon-/annonseringsflate

Dette gjør produktet bredt, men også mer fragmentert enn nødvendig.

### IA-problemer
- Forsiden prioriterer ikke hardt nok hva hovedproduktet er.
- `Alle spill` starter med mye tematisk navigasjon før brukeren faktisk ser spill.
- Themesidene har lange introer som skyver kortene nedover, spesielt på mobil.
- Drikkeleker, musikkeleker og skjermleker er fine som støtteinnhold, men stjeler i dag litt for mye lik visuell vekt fra kjerneproduktet.
- Donasjon og annonseplassholdere er for synlige tidlig i reisen.

### Tydeligere produktretning
GameNight bør fremstå tydeligere som:
“den norske appen/nettsiden du åpner for å starte festspill på én skjerm”

Sekundært:
- klassiske drikkeleker
- kuraterte temasider
- støtteinnhold og guider

Ikke omvendt.

## Analyse av spillsidene som opplevelse
Dette er området med størst forbedringspotensial.

### Det som fungerer
- Selve kortflyten er enkel å forstå.
- “Neste kort”-mekanikken er lav friksjon.
- Korttyper har noen visuelle forskjeller.
- Sticky handling nederst fungerer bra på mobil.
- Spin/physical-item har egne flows, noe som er riktig retning.

### Det som mangler
- Oppstart har for lite forventningsbygging.
- Consent/mode/instruction-skjermene er korrekte, men flate og generiske.
- Selve kortene mangler nok dramaturgi og karakter.
- For mange ulike typer innhold får samme visuelle mal.
- Kort med regler som varer over flere runder får ingen vedvarende UI-støtte.
- Avslutningen føles mer som “ferdig skjerm” enn som payoff.

### Særlig viktig observasjon
På desktop blir game shell for lite dominerende. Kortet tar for liten plass, og relaterte lenker + annonse kommer for nær spillvisningen. Det gjør at spillsiden føles som en nettside med et spill inni, i stedet for en spillopplevelse med litt nettside rundt.

### Min vurdering
GameNight bør ha et tydeligere “focus mode”-tankesett på spillsider:
- mer skjermplass til selve kortet
- mindre konkurrerende innhold under aktiv spilling
- sterkere overgang mellom kort
- tydeligere pre-game, active-game og post-game states

## Kortvisning og korttypene
`TaskCard` er et av de bedre områdene i dagens UI, men det er fortsatt ikke nok.

### Bra
- Fargebruk per korttype hjelper.
- Typografi på kortene er stor og lesbar.
- Ikon/emoji/hint bygger litt semantikk.

### Svakt
- Mange kort oppleves fortsatt som “stor tekst i en boks”.
- Det er for lite forskjell mellom rolig prompt, kaosutfordring, pekelek og bekjennelse.
- De visuelle hintene er der, men ikke sterke nok til å skape rytme.
- Lange tekster og regelkort får samme dramaturgi som enkle, morsomme énlinjere.

### Anbefalt retning
- Mer ulike kortoppsett per type
- tydeligere visuell takt per kategori
- sterkere bevegelse mellom state-overganger
- egne mønstre for “regelkort”, “alle”, “duell”, “bekjennelse”, “straff”

## Oppsummering som payoff
Oppsummeringen har høy sosial verdi, men er ikke helt der ennå som finale.

### Det som fungerer
- Delbarhet er smart.
- “Kveldens Dom” er et godt konsept.
- Visuell festlighet og konfetti hjelper.

### Det som trekker ned
- Kåringene må forklares bort med caveat om begrenset tracking.
- Opplevelsen føles mer som et sideverktøy enn som en stor avslutning på en kveld.
- Donasjonsblokken kommer ganske fort inn og drar litt fokus bort fra payoff.

### Min vurdering
Oppsummeringen er nærmest ekte produktmagi i dagens app, men trenger mer troverdighet og mer finalesans. Dette er et av de beste stedene å investere videre.

## Analyse av mobilopplevelsen
Mobil er den sterkeste flaten i produktet i dag, men også her er det tydelige svakheter.

### Det som fungerer
- Knapper er stort sett store nok.
- Kortlesbarhet er som regel god.
- Sticky nederste handling i spill er riktig mønster.
- Spillflyten er generelt enkel nok til å fungere på en håndholdt skjerm.

### Det som ikke føles bra
- Forsiden bruker for mye høyde på branding og for lite på faktisk valg.
- All-games bruker for mye plass på theme chips og filterlag før resultatene kommer.
- Themesider og infosider blir lange tekstvegger før handlingen kommer.
- Cookie-banneret tar merkbar plass i førsteinntrykket.
- PWA/install-verdi er ikke tydelig nok for iPhone-brukere som ikke får native install prompt.

### Mobilkonklusjon
Mobil fungerer, men ikke optimalt. Det er mer “fungerende” enn “stramt og deilig”.

## Analyse av desktop og TV-/skjermdelingsbruk
Desktop er i dag den svakere UX/UI-flaten.

### Problemet
- Layouten skalerer opp, men opplevelsen skifter ikke karakter.
- For mye luft rundt game cards uten at kortet får mer autoritet.
- Små UI-elementer som progresjon og meny blir litt puslete på stor skjerm.
- SEO-/footer-/relatert-innhold blir synlig for tidlig under spillet.

### Konsekvens
Ved skjermdeling eller TV-bruk føles ikke GameNight helt som en “visningsflate”. Det føles som en vanlig nettside i fullskjerm.

### Retning videre
Det trengs ikke egen TV-mode nå, men desktop bør oppføre seg mer som en shared-screen-presentasjon:
- større type
- bredere kort
- tydeligere kontrast
- mindre perifer UI
- mer fokusert spillflate

## Vurdering av visuell identitet
Dette er en av de tydeligste svakhetene i produktet.

### Det som finnes i dag
- Mørk rød/brun base
- korall/rød primærfarge
- Poppins overalt
- glassaktige kort
- lett gradientbakgrunn

### Hvorfor det ikke er nok
- Det føles for nært et standard Tailwind/shadcn-univers.
- Det er for lite særpreg i layout, typografi og bevegelse.
- Det er for lite visuell forskjell mellom “rolig”, “kaos”, “flørt”, “klassisk” og “voksen”.
- Logoen har mer personlighet enn resten av grensesnittet.

### Min vurdering
GameNight trenger en tydeligere produktpersonlighet:
- morsom
- sosial
- trygg
- litt cheeky
- selvsikker

Ikke vulgær. Ikke barnslig. Men tydelig mer levende enn i dag.

## Vurdering av install/PWA/oppsummering/trust-sider
### Install / PWA
Teknisk er det bra nok. UX-messig er det bare delvis bra.

Bra:
- prompten er forsiktig
- mobilprioritert visning er riktig
- install er ikke tvunget

Svakt:
- verdien av install er underkommunisert
- iOS må forstå manuell install via infosider
- PWA føles mer som en teknisk bonus enn som en tydelig del av produktet

### Trust-sider
Bra:
- gir troverdighet
- god støtte for SEO/publisher-readiness

Svakt:
- de føles visuelt for like resten av nettstedet
- de er litt lange og templatede
- annonseplassholdere på slike sider svekker troverdigheten

### Oppsummering
Sterk idé, middels utførelse. Bør løftes.

## Vurdering av dagens UX/UI-retning
Dagens retning er for forsiktig.

Den er ikke direkte feil. Men den prøver å være ryddig og trygg i så stor grad at produktet mister noe av sin energi, selvtillit og særpreg.

Jeg mener:
- GameNight er for generisk visuelt
- GameNight er for lite party i presentasjonen
- GameNight er for lite kuratert i hierarkiet
- GameNight føles fortsatt delvis som en funksjonell prototype

Det betyr ikke at produktet må bli kaotisk. Det betyr at det må bli tydeligere.

## Forslag til UX/UI-retning videre
Anbefalt retning:

### 1. Tydeligere produktfokus
GameNight bør først og fremst føles som et sted du åpner for å starte kveldens spill. Alt annet er støtteinnhold.

### 2. Mer kuratert katalog
Færre svake eller overlappende spill synlig. Høyere gjennomsnittskvalitet er viktigere enn bredde i katalogen.

### 3. Mer immersiv spillskall
Under aktiv spilling bør UI-en være mer fokusert, større og mer presentasjonsvennlig.

### 4. Sterkere dramaturgi
Oppstart, aktiv runde og avslutning bør føles som tre tydelige akter, ikke bare ulike templates.

### 5. Sterkere merkevareuttrykk
Bygg et visuelt språk som faktisk matcher logo, tone og målgruppe.

## Tanker om fremtidig theming / sesongdesign
### Er dagens design/arkitektur egnet?
Bare delvis.

Dagens system har:
- ett globalt sett med CSS-variabler
- hardkodede visuelle varianter i komponentene
- `themes.json` som innholdskuratering, ikke visuell theming

Det betyr at sesongdesign kan legges på senere, men ikke på en særlig elegant måte uten opprydding først.

### Hvordan bør theming tenkes?
Det bør skilles mellom:
- innholdstemaer
- spillmood
- sesongtemaer

Disse er ikke det samme.

### Anbefalt modell
#### Basenivå: permanent brand system
- globale design tokens
- tydelig typografi
- stabile komponentvarianter

#### Mellomnivå: mood-system for spill
- rolig
- party
- kaos
- flørt
- spicy
- sesong

Dette bør kunne påvirke:
- bakgrunn
- badge-stil
- korttoner
- CTA-accenter
- mikroanimasjon

#### Toppnivå: sesongoverlays
Bruk til:
- jul
- halloween
- 17. mai
- kvinnedagen
- fadderuke/russetid

### Hvor tydelige bør themes være?
Min anbefaling:
- subtile variasjoner som standard
- tydeligere takeovers kun for de største, naturlige sesongene

God balanse:
- Jul / Halloween: kan ha tydelig takeover
- 17. mai / Kvinnedagen: bør være mer kuratert og subtilt
- øvrige anledninger: badge-/accent-nivå, ikke full reskin

### Hva bør planlegges nå
- sentralisering av design tokens
- komponentvarianter basert på semantiske tokens, ikke hardkodede farger
- enkel sesongmanifest-struktur
- asset-slots for logo-variant, confetti, badges, hero-accenter

## Konkrete anbefalinger for neste fase
Dette er de høyeste UX/UI-grepene per effekt, ikke nødvendigvis per implementasjonsletthet.

1. Rebygg forsiden rundt “start noe nå”, og få faktiske spillkort eller anbefalte startere høyere opp.
2. Flytt `PartyTools`, donasjon og sekundærinnhold lenger ned i hierarkiet.
3. Rydd hardt i katalogen: skjul eller fjern svake, dupliserte og halvsterke spill fra hovedflater.
4. Gjør `Alle spill` mindre topptung ved å tone ned theme chip-veggen og vise resultater raskere.
5. Lag en mer immersiv game shell der aktiv spilling får mer plass og mindre konkurrerende UI.
6. Redesign pre-game-state for samtykke, modusvalg og instruksjon så de bygger forventning i stedet for bare å informere.
7. Utvid kortsystemet fra “stor tekst i en boks” til tydeligere mønstre per korttype og intensitet.
8. Fjern eller ton kraftig ned annonseplassholdere på kritiske og tillitssensitive flater, særlig i gameplay og trust-sider.
9. Optimaliser desktop/shared-screen med større typografi, bredere kort og mindre nettsidefølelse under spill.
10. Definer et reelt visuelt system for GameNight med sterkere typografi, mer særegen fargebruk og planlagte mood-/sesongtokens.

## Prioritert gjennomføringsretning
### Fase 1 – Produktfokus og kuratering
- forside
- alle spill
- tema-hierarki
- skjule svak katalog
- rydde bort forstyrrende sekundærflater

### Fase 2 – Game experience
- pre-game-states
- in-game-shell
- kortsystem
- avslutning og payoff
- desktop/shared-screen

### Fase 3 – Brand og themes
- visuell identitet
- typografi
- motion-prinsipper
- semantiske tokens
- sesongsystem

## Sluttvurdering
GameNight er i dag bra nok til å brukes, men ikke bra nok til å føles ferdig.

Produktet har:
- et godt fundament
- et tydelig bruksområde
- mye faktisk verdi

Men UX/UI-en mangler fortsatt:
- hard prioritering
- sterk nok produktpersonlighet
- nok dramaturgi i gameplay
- nok visuell modenhet

Min tydelige anbefaling er derfor:
Ikke bare puss litt videre på dagens retning. Gi GameNight et merkbart UX/UI-løft i neste runde.
