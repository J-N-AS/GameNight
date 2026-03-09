# GameNight – Rule Content Review

Dato: 9. mars 2026  
Repo: `/Users/naleyjanhelge/DEV/GameNight`

## Kort oppsummert
Denne runden var målrettet mot spill som allerede har naturlig plass til vedvarende regler: klassiske drikkeleker, partyspill og kaos-decks der enkle husregler gjør bordet morsommere over tid.

Jeg har bevisst ikke presset rule-kort inn i roligere spørrespill eller mer samtaledrevne decks. Målet har vært tydeligere regel-loop, ikke bare flere regler.

## Spill som ble endret

### `src/data/drikkeleker.json`
- Forbedret `Ring of Fire` med tydeligere levetid på klassiske running rules.
- Presiserte at vedvarende regler varer til kortteksten sier noe annet, og at samme korttype erstatter tidligere versjon.
- Strammet opp `Tommel-mester`, `Drikkevenner`, `Husregel` og `Spørsmåls-mester`.

### `src/data/party-klassikere.json`
- Omskrev flere løse regelkort til tydelige running rules med varighet eller erstatning.
- La inn `Regelpause` for å rydde opp i aktive regler underveis.
- Forbedret blandingen av navneforbud, tommelregel, albue-regel, drikkevenner og forbudt ord.

### `src/data/kaosrunden.json`
- Gjorde decket mer bevisst kaotisk med regler som faktisk lever noen runder og så dør.
- La inn tydelig `kaosregel`, `navnekaos`, `tommelpanikk`, `forbudt ord`, `kaosvenner` og `regel-reset`.
- Prioriterte korte regler som er lette å lese høyt og lette å håndheve sosialt.

### `src/data/vorspiel-mix.json`
- Gjorde de eksisterende regelkortene mer komplette med varighet, erstatning og enklere språk.
- La inn en lettere rule-loop som passer vors: drikkepartner, husregel, tommel-mester, forbudt ord, navnefelle og regelpause.
- Holdt reglene korte og milde nok til at decket fortsatt føles sosialt og ikke bare straffebasert.

### `src/data/julebord.json`
- Forsterket det sesongbaserte decket med noen få tydelige jule-regler i stedet for bare engangskort.
- La inn `Juleforbud`, `Nissemester`, `Nissevenner` og `Regelpause`.
- Beholdt julebord-tonen muntlig og enkel, uten å gjøre decket for administrativt.

## Typer vedvarende regler som ble brukt
- Parregler: drikkepartner, drikkevenner, kaosvenner, nissevenner.
- Rolle/regelmester-kort: tommel-mester, spørsmåls-mester, nissemester.
- Forbudsregler: forbudte ord, navneforbud, peke-forbud.
- Husregler med levetid: spiller lager én enkel regel for et begrenset antall runder.
- Regelstoppere: regelpause og reset-kort som rydder bordet.

## Spill som egner seg godt for denne typen innhold
- `Ring of Fire` egner seg svært godt fordi kortmappingen allerede bygger på kjente running rules.
- `Party Klassikere` og `Vorspiel Mix` tåler flere vedvarende regler fordi de allerede er brede, sosiale partydecks.
- `Kaosrunden` er kanskje det beste stedet for korte, tydelige regel-loop-er fordi hele identiteten er uforutsigbarhet og sosial straff.
- `Julebordet` tåler noen få running rules fordi ordforbud, gestregler og makkerregler passer temaet godt.

## Spill jeg bevisst ikke prioriterte i denne runden
- `Afterparty` ble ikke endret fordi decket er roligere og mer refleksjonsdrevet. Running rules ville fort blitt støy.
- `Fadderkampen` og `Hyttekos & Afterski` har plass til noen flere regler senere, men denne runden var bedre brukt på sterkere partydecks.
- `Kjapp Party-runde` ble stående fordi decket lever på tempo og enkelhet. For mange running rules ville svekket identiteten.

## Hva som fungerer godt uten motorendringer
- Korte forbudsord som varer i 2-4 runder.
- Enkle buddy-/partnerregler.
- Gestregler som tommel på bordet eller usynlig nisselue.
- Én aktiv husregel om gangen, så lenge kortteksten selv sier at ny regel erstatter gammel.
- Reset-kort som gruppa håndhever verbalt.

Dette fungerer fordi reglene er muntlige, synlige i øyeblikket og kan huskes uten UI-støtte.

## Begrensninger i dagens motor
- Motoren sporer ikke aktive regler eller viser dem i UI.
- Motoren teller ikke runder for aktive effekter.
- Motoren håndhever ikke når en regel er opphevet, erstattet eller glemt.
- Det finnes ikke egne regeltyper eller metadata for varighet, kategori eller prioritet.
- Det finnes ingen aktiv liste over roller som `Tommel-mester`, `Question Master` eller buddy-par.

Derfor må alle reglene i denne runden fungere på ren sosial håndheving.

## Regler som sannsynligvis trenger egen motorstøtte senere
- Regler som skal vare nøyaktig et bestemt antall runder og vises med nedtelling.
- Flere samtidige regler med behov for oversikt over hva som fortsatt er aktivt.
- Regler som bør ha automatisk erstatning innen kategori, for eksempel bare én aktiv tommelregel og én aktiv ordregel.
- Regler som knytter bestemte spillere sammen over tid og burde vises eksplisitt i UI.
- Regler med automatisk oppheving når et bestemt framtidig kort trekkes, hvis man vil at appen skal minne gruppa på det.

## Anbefaling for en senere spillmotor-runde
- Innfør enkel støtte for `activeRules` med tekst, kildekort og utløpsbetingelse.
- Legg til valgfri metadata for `duration`, `ruleCategory` og `replacesCategory`.
- Vis aktive regler som små badges eller en liste i spillvisningen.
- Vurder et eksplisitt rule-kort-format senere, men bare hvis det faktisk brukes til UI-støtte og ikke bare som ny label.

Denne innholdsrunden viser at mye kan løftes bare med bedre tekstdesign. Neste nivå krever synlig regelstate i motoren.
