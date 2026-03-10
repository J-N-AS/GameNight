# Gameplay Polish Round

Oppdatert: 10. mars 2026

Denne runden var en kontrollert gameplay-polish, ikke en full redesign av GameNight.

Målet var å løfte:

- spillkortene
- gameplay-rytmen
- focus mode under spilling
- aktive regler / running rules
- visuell energi og fargebruk i gameplay

Det ble bevisst ikke gjort store grep i forside, temasider, trust-sider, SEO-struktur, routing eller PWA-oppsett.

## Hva som ble forbedret

### 1. TaskCard ble redesignet som spillflate

`TaskCard` er gjort merkbart mer app-aktig og mindre som en vanlig web-boks:

- større og mykere radius (`rounded-[2.5rem]`)
- mer dybde via gradient, glow og lagdelte fargeflater
- tydelig badge/pill øverst med ikon og kortidentitet
- langt større og tyngre hovedtekst for lesing på avstand
- roligere sekundærtekst
- bedre plassbruk i focus mode, slik at kortet får mer scene

Kortene er nå bygget som egne gameplay-flater med visuell tyngde, ikke bare tekst i et generisk card-komponentmønster.

### 2. Korttypene har tydeligere identitet

Gameplay-visningen skiller nå tydeligere mellom:

- `challenge` / utfordring
- `never_have_i_ever` / bekjennelse
- `prompt` / spørsmål
- `pointing` / pekelek
- `truth_or_shot` / presskort
- `versus` / duell
- regelkort (`task.rule`)
- kaoskort og hemmelige spesialkort via lett metadata + heuristikk

Dette løses med egne tonevalg, badges, gradients, glow og hint-tekster per kortfamilie.

### 3. Swipe/reveal mellom kort

Kortbytte føles nå mindre som ren state-oppdatering og mer som et fysisk kortskifte:

- gammelt kort går ut mot venstre
- nytt kort kommer inn fra høyre
- liten rotate/scale/blur brukes for rytme
- overgangene er korte nok til å holde tempoet oppe

Dette gjelder både vanlig kortflyt og de fleste spesialflyter som fysisk gjenstand og virtuell flaske.

### 4. Impact moments

Det er lagt inn en enkel impact-modell i gameplay-laget.

`GameTask` kan nå valgfritt ha `moment`:

- `impact`
- `chaos`
- `secret`
- `group`

I tillegg brukes eksisterende `rule` og `versus` som naturlige impact-kilder.

Når et slikt kort vises, får spilleren en kort reveal-state før selve kortet:

- `NY REGEL`
- `KAOSKORT`
- `HEMMELIG OPPDRAG`
- `ALLE INN`
- `DUELL`

Reveal-state varer kort og automatisk, slik at den gir dramaturgi uten å bremse spillet for mye.

### 5. Running rules / aktive regler

Den eksisterende lette regelmotoren ble beholdt, men gameplay-visningen rundt den ble forbedret:

- aktive regler vises nå i et mer kompakt og levende panel
- panelet viser raske forhåndsvisninger selv når det ikke er utvidet
- pause / fortsett / opphev finnes fortsatt
- kategori og gjenværende runder er tydeligere

I denne runden ble også enkelte redaksjonelle kort gjort til faktiske aktive regler:

- hemmelig aksentregel i `hemmelig-bonus`
- `Konge/Dronning` i `hemmelig-bonus`
- nytt kallenavn i `hemmelig-bonus`

Det gjør at noen flere regelkort faktisk lever videre i UI-en i stedet for å forsvinne med en gang.

### 6. Focus mode og gameplay-shell

Selve spillskjermen er strammet opp rundt gameplay:

- mindre nettsidefølelse i aktiv spilling
- sterkere bakgrunnsaura rundt kortet
- diskret toppinfo i stedet for tungt sidekrom
- tydeligere kortnummer/progresjon
- mer taktil og chunky `Neste kort`-knapp
- annonsedel i aktiv spilling er tonet helt ut fra `GameClient`

Målet har vært `less UI, more game`.

## Korttyper og deck som fikk ekstra behandling

Noen deck fikk også lett redaksjonell metadata for større moments:

- `kaosrunden`
  - flere kort markert som `chaos`, `group` eller `impact`
- `party-klassikere`
  - klassiske all-in-kort markert som `group`
- `vorspiel-mix`
  - enkelte gruppe- og trykkort markert som `group` eller `impact`
- `hemmelig-bonus`
  - utvalgte kort markert som `secret`
  - flere langvarige effekter fikk faktisk `rule`-metadata

Dette er bevisst lite og pragmatisk, ikke en tung ny innholdsmodell for hele biblioteket.

## Filer som ble endret i gameplay-laget

Sentrale kodefiler:

- `src/components/game/GameClient.tsx`
- `src/components/game/TaskCard.tsx`
- `src/components/game/ActiveRulesPanel.tsx`
- `src/components/game/GameMenu.tsx`
- `src/components/game/ImpactMomentReveal.tsx`
- `src/lib/gameplay.ts`
- `src/lib/types.ts`

Oppdatert innhold:

- `src/data/kaosrunden.json`
- `src/data/party-klassikere.json`
- `src/data/vorspiel-mix.json`
- `src/data/hemmelig-bonus.json`

## Hva som fortsatt bør tas senere

Denne runden løfter gameplay merkbart, men noen ting bør fortsatt vurderes i senere iterasjoner:

- mer bevisst pre-game-staging på consent / mode-select / instruction
- mer eksplisitt støtte for spesifikke roller som `Question Master`
- bedre desktop/shared-screen-komposisjon helt i toppsjiktet
- mer redaksjonell kuratering av hvilke kort i flere deck som bør være impact-kort
- eventuelt mer troverdig post-game / oppsummeringspayoff

## Verifisering

Kjørt etter endringene:

- `npm run typecheck`
- `npm run build`
- `npm run build:export`

Målet med denne runden var å gjøre gameplay mer levende uten å rive opp resten av produktet. Den balansen er bevisst holdt: mer farge, mer rytme og mer spillfølelse, men fortsatt samme enkle én-enhets-modell og samme statisk-first-produkt.
