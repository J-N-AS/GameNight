# Gameplay design

## Formål

Dette dokumentet beskriver hvordan GameNight-spill bør føles, ikke bare hvordan de er implementert. Målet er å gjøre nye spill og nye spillkort mer konsistente på tvers av biblioteket.

## Grunnprinsipper

### Rask lesing

Et spillkort skal kunne leses høyt uten forklaring. Kort tekst, én tydelig handling og minst mulig administrasjon er som regel riktig.

### Sosial energi

GameNight fungerer best når kortene skaper:

- reaksjon
- latter
- kort diskusjon
- liten risiko for stillstand

### Én skjerm, mange blikk

Kortene må være forståelige når én person leser og resten følger med på avstand. Det betyr tydelig språk og begrenset kompleksitet.

## Kortfamilier

Dagens system har seks viktige kortfamilier:

- `prompt` for spørsmål og refleksjon
- `challenge` for handling og tempo
- `pointing` for raske sosiale dommer
- `never_have_i_ever` for kollektiv bekjennelse
- `truth_or_shot` for press med tydelig valg
- `rule` som vedvarende spillkort gjennom metadata

Hver familie bør ha en egen rytme og rolle i decket.

## Gameplay-rytme

Et godt GameNight-deck veksler normalt mellom:

1. enkle startkort
2. sosial eskalering
3. noen få tydelige toppunkter
4. eventuell reset eller pustepause

Deck som bare gjentar samme type kort blir fort flate, selv om enkeltkortene er gode.

## Impact moments

`moment` skal brukes sparsomt. Det er til for kort som skal føles større enn resten av decket.

Bruk `impact` når kortet er et tydelig høydepunkt.

Bruk `group` når hele rommet skal inn samtidig.

Bruk `chaos` når kortet skal oppleves som brått, høyere og mer uforutsigbart.

Bruk `secret` når kortet skal ha hemmelig eller mer langvarig effekt.

Hvis for mange kort får `moment`, mister reveal-effekten verdi.

## Running rules

Running rules fungerer best når de er:

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
- regler som trenger komplisert UI for å forstås
- regler som skaper for mye administrasjon

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
- running rules krever mer oppfølging enn gruppa realistisk orker

Et enklere deck med sterkere rytme er som regel bedre enn et smart deck som ingen orker å drifte.
