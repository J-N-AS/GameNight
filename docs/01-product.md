# GameNight produkt

## Hva GameNight er

GameNight er en norsk festspillplattform for voksne 18+. Produktet kombinerer:

- digitale spill med spillkort i nettleseren
- temabaserte innganger for ulike kvelder og målgrupper
- klassiske drikkelek-artikler for søk og oppdagelse
- støtteinnhold som FAQ, vilkår og oppsummering

Kjerneopplevelsen er enkel: åpne siden, velg et spill, og la én mobil eller nettleser styre hele spilløkten.

## Produktmål

GameNight skal være:

- raskt å starte
- gratis å bruke
- lett å forstå
- bygget for sosial bruk på én skjerm
- godt egnet for både mobil og delt skjerm/TV

Produktet skal ikke være:

- en multiplayer-app med synk mellom flere enheter
- et konto- eller abonnementstungt produkt
- et admin- eller CMS-drevet system
- avhengig av database eller backend for å fungere

## Målgruppe

Primærmålgruppen er voksne brukere i sosiale settinger:

- vorspiel
- studentfester og fadderuke
- hytteturer og julebord
- vennekvelder og bursdager
- russetid

Noe innhold er trygt og sosialt, noe er tydelig 18+ med samtykkeskjerm. Produktet skal være brukbart både som drikkespill og som sosialt spill uten alkohol.

## Produktprinsipper

### Én enhet styrer

GameNight er bygget rundt én skjerm per spilløkt. Det betyr:

- én person styrer kortene
- gruppen spiller sammen i samme rom
- spillerliste og enkel statistikk lagres lokalt i nettleseren
- skjermdeling til TV er støttet som bruksmønster, men ikke som egen runtime-modus

### Lav friksjon

- ingen login
- ingen konto
- ingen låste spillpakker
- ingen onboarding som blokkerer spillstart

### Innhold først

GameNight er i praksis et data-drevet produkt. Spill, temaer og artikler ligger i repoet og lastes som statisk innhold. Det gjør produktet lett å drifte, lett å hoste og lett å videreutvikle.

## Produktflater

### Kjerneprodukt

Dette er den viktigste løkken i produktet:

`forside -> spillvalg -> gameplay -> oppsummering`

Den viktigste delen av GameNight er fortsatt selve spilløkten.

### Oppdagelse og distribusjon

Disse flatene hjelper brukere å finne riktig spill:

- `Alle spill`
- temasider fra `themes.json`
- dedikerte huber som `/fadderuka` og `/russetiden`

### SEO- og støtteinnhold

Disse flatene støtter oppdagelse, tillit og langsiktig distribusjon:

- `/drikkeleker` og `/drikkeleker/[slug]`
- `/musikkleker`
- `/skjermleker`
- `/info/*`
- `/faq`
- `/vilkar`
- `/changelog`

## Dagens strategi

Produktstrategien i repoet akkurat nå er:

1. gjøre spillbiblioteket tydeligere og bedre kuratert
2. forbedre gameplay og mobil-lesbarhet uten å bygge tung motor
3. bruke temaer, artikler og huber til å skape distribusjon
4. holde monetisering lett og sekundær til selve spillopplevelsen

Se `09-roadmap.md` for prioritert videre retning.
