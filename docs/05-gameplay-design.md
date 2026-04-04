# Gameplay design

## Formål

Dette dokumentet beskriver hvordan GameNight-spill bør føles, ikke bare hvordan de er implementert. Målet er å gjøre nye spill og nye spillkort mer konsistente på tvers av biblioteket.

## Grunnprinsipper

### Rask lesing

Et spillkort skal kunne leses høyt uten forklaring. Kort tekst, én tydelig handling og minst mulig administrasjon er som regel riktig.

### Standalone card rule

Hvert kort må fungere som en komplett enhet.

Det betyr:

- kortet må være forståelig uten at brukeren ser kategorioverskrifter andre steder
- kortet må gi mening første gang det leses høyt
- viktig logikk må stå i selve kortteksten, ikke være avhengig av tidligere kort

GameNight-badges og farger er støtte, ikke bærende forklaring.

### Sosial energi

GameNight fungerer best når kortene skaper:

- reaksjon
- latter
- kort diskusjon
- liten risiko for stillstand

### Én skjerm, mange blikk

Kortene må være forståelige når én person leser og resten følger med på avstand. Det betyr tydelig språk og begrenset kompleksitet.

### Ett skjermbilde er idealet

På mobil bør kort, undertittel og interaksjon normalt få plass uten scroll. Hvis et deck ofte krever mer høyde enn dette, er kortene som regel for lange eller typografien for aggressiv.

## Kortfamilier

Dagens system har seks viktige kortfamilier:

- `prompt` for spørsmål og refleksjon
- `challenge` for handling og tempo
- `pointing` for raske sosiale dommer
- `never_have_i_ever` for kollektiv bekjennelse
- `truth_or_shot` for press med tydelig valg
- `rule` som regelkort gruppa husker sosialt

Hver familie bør ha egen rytme og egen setningsform.

## Anbefalt setningsstruktur per korttype

### `challenge`

Skriv direkte og handlingsdrevet.

Gode mønstre:

- `{player}, gjør X`
- `Alle gjør X`
- `{player}, du har 10 sekunder til X`

Unngå:

- flere separate oppgaver i samme kort
- lange sidevilkår

### `prompt`

Skriv som et muntlig spørsmål som tåler å bli lest høyt.

Gode mønstre:

- `{player}, hva er ...?`
- `Hva er ... , {player}?`
- `Pest eller kolera: ...?`

### `pointing`

Skriv som kollektiv vurdering.

Gode mønstre:

- `Hvem her ...?`
- `Hvem i rommet ...?`

Dette skal få gruppa til å peke, ikke forklare.

### `never_have_i_ever`

Hold formen streng:

- `Jeg har aldri ...`

Denne kategorien fungerer best når den er konsekvent.

### `truth_or_shot`

Kortet må føles som et presskort, ikke som et vanlig spørsmål.

Gode mønstre:

- `{player}, hva er ...?`
- `{all}: Har du ...? Hvis ja, tar du straffen.`

### `versus`

Kortet må ende i en tydelig stemmesituasjon.

Gode mønstre:

- `Hvilket lag ...?`

## Gameplay-rytme

Et godt GameNight-deck veksler normalt mellom:

1. enkle startkort
2. sosial eskalering
3. noen få tydelige toppunkter
4. eventuell reset eller pustepause

Deck som bare gjentar samme type kort blir fort flate, selv om enkeltkortene er gode.

## Impact moments og tone

`moment` skal brukes sparsomt. Det er til for kort som skal føles større enn resten av decket.

I dagens gameplay skjer dette først og fremst gjennom:

- innhold
- tone
- fargevalg

ikke gjennom egne mellomskjermer i standardflyten.

Bruk:

- `impact` når kortet er et tydelig høydepunkt
- `group` når hele rommet skal inn samtidig
- `chaos` når kortet skal oppleves bråere og villere
- `secret` når kortet skal føles skjult eller mer langvarig

Hvis for mange kort får `moment`, mister markeringen verdi.

## Regler som varer utover ett kort

Disse fungerer best når de er:

- korte
- lette å huske
- sosialt håndhevbare
- tydelige i start og slutt

Gode eksempler:

- forbudte ord
- tommelregel
- drikkevenn
- enkel husregel

Dårlige kandidater:

- regler som krever nøyaktig tracking av mange spillere
- regler som trenger eget UI for å fungere
- regler som skaper for mye administrasjon

GameNight antar fortsatt at gruppa selv husker disse reglene i live gameplay. Hvis et spill bare fungerer med et vedvarende regelpanel, passer det dårlig i dagens aktive gameplay-flate.

## Retningslinjer for kortskriving

- skriv i muntlig norsk
- hold ett kort til én handling eller ett tydelig spørsmål
- bruk placeholders når tilfeldige spillere skal trekkes inn
- bruk `{all}` bare når hele gruppa faktisk skal gjøre noe
- unngå å gjemme viktig logikk i lange parenteser
- skriv alltid med tydelig samtykke og respekt for grenser i 18+-spill

## Placeholders som designverktøy

Placeholders bør brukes bevisst:

- `{player}` når én aktiv spiller er riktig
- `{player2}` bare når en ekstra rolle faktisk gir mening
- `{team1}` og `{team2}` bare i lagspill

Hvis et spill trenger mange roller, faste par eller komplekse lagbytter, passer det sannsynligvis dårlig i dagens motor uten ny systemstøtte.

## Unngå tvetydige ord

Bruk ikke vage formuleringer når motoren kan være tydeligere.

Spesielt:

- unngå `noen` i råkorttekst når `{player}` eller `{all}` egentlig er riktig
- unngå `en tilfeldig spiller` når motoren allerede kan trekke en spiller
- unngå `en annen person` hvis `{player2}` er mer presist

Viktig nyanse:

- runtime kan selv sette inn `Noen` og `En annen` i skjulte-navn-kort som `pointing` og `never_have_i_ever`
- det betyr ikke at forfattere bør bruke samme mønster i kildeteksten

## Hvorfor spillene er designet slik

GameNight prioriterer:

- lav oppstartsterskel
- tydelig sosial payoff
- høy lesbarhet
- data-drevet utvidbarhet

Det er derfor mange av de sterkeste spillene i biblioteket er enkle i formatet, men tydelige i tonen.

## Når et spill bør forenkles

Forenkle heller enn å overmodellere når du ser dette:

- kortene trenger forklaring hver gang
- kortene føles like, selv om teksten er ulik
- spillet krever logikk som ikke finnes i motoren
- regler som varer krever mer oppfølging enn gruppa realistisk orker

Et enklere deck med sterkere rytme er som regel bedre enn et smart deck som ingen orker å drifte.
