# Dokumentasjonsstatus

Oppdatert: 10. mars 2026

Denne mappen inneholder en blanding av levende dokumentasjon, strategidokumenter og historiske audits. Etter rollback og opprydding bør dokumentene leses slik:

## Gjeldende kilder

- `../README.md`: overordnet repooversikt, stack, scripts og deploy.
- `architecture.md`: hvordan appen faktisk er bygget nå.
- `hosting.md`: anbefalt hosting og deployflyt.
- `product.md`: produktprinsipper, målgruppe og struktur.
- `seo-publisher-readiness.md`: nåværende SEO- og publisher-status.
- `../SPILL_OVERSIKT.md`: oppdatert spillkatalog og korttall.
- `../public/llms.txt`: kort maskinlesbar prosjektbeskrivelse.

## Strategi og retning

- `ux-ui-strategy-review.md`: designkritikk og produktvurdering, ikke implementasjonsfasit.
- `gamenight-2-roadmap.md`: intern roadmap, ikke beskrivelse av hva som allerede finnes.
- `rule-content-review.md`: historisk innholdsgjennomgang.
- `blueprint.md`: tidlig konseptnotat, ikke gjeldende featurespesifikasjon.

## Historiske snapshots / audits

- `current-state-report.md`
- `quality-and-bug-audit.md`
- `seo-adsense-audit.md`

Disse filene er nyttige som analyser av et tidspunkt i prosjektet, men enkelte konkrete funn er allerede løst i dagens kode. Ved konflikt mellom disse filene og repoet er det koden, `../README.md` og dokumentene under "Gjeldende kilder" som gjelder.

## Viktige korreksjoner etter oppryddingen

- `/alle-spill` rendrer server-HTML med ekte lenker og bruker ikke lenger `useSearchParams` for førstevisning.
- `spinn-flasken-ekte` og `spinn-flasken-virtuell` bruker preset `spinMode`.
- `minPlayers` og spillerkrav-guards finnes i dagens løsning.
- `public/llms.txt` beskriver ikke lenger full offline-støtte eller Firebase-hosting.
