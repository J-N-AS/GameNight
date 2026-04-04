# Monetization

## Dagens status

GameNight har lettvektsmonetisering, men ikke “null monetisering”. Det finnes faktisk live annonse- og consent-logikk i repoet.

Det som faktisk finnes i koden:

- `CookieConsent` for samtykke
- `ConsentManagedGoogleScripts` som laster Google Analytics og Google AdSense etter samtykke
- `AdBanner` med reell AdSense-slot
- `AdAccessGate` som kan blokkere store deler av appen uten consent eller ved adblock
- donasjonsadapter i `src/lib/donations.ts`
- `public/ads.txt`

Det som ikke finnes:

- innebygd betalingsbackend
- abonnement
- låste spillpakker
- konto- eller profilbasert monetisering
- egen CMP-plattform utover lokal consent-logikk i appen

## Viktig produktspenning

Produktfilosofien til GameNight er lav friksjon, rask oppstart og “ingen SaaS-følelse”.

Monetisering gjør likevel at dagens implementasjon har mer friksjon enn idealet:

- brukeren kan møte en consent-banner
- appen kan vise en full-screen gate hvis annonser ikke kan lastes
- analytics og ads er koblet til samtykke

Dette er en reell del av dagens produkt og må tas med i vurderingen når man foreslår UX-endringer.

## Donasjoner

Donasjon er en ekstern integrasjon.

`requestDonation(amount)`:

- leser `NEXT_PUBLIC_DONATION_API_URL`
- sender `POST { amount }` til ekstern tjeneste
- forventer JSON-respons med status og eventuell checkout-URL

Hvis miljøvariabelen mangler, viser appen bare en vennlig melding om at donasjon ikke er konfigurert.

Repoet eier ikke checkout eller betalingsflyt.

## Annonser

Annonser er ikke bare plassholdere lenger.

Faktisk flyt:

1. brukeren gir samtykke
2. Google Analytics og AdSense-scripts kan lastes
3. `AdBanner` forsøker å initialisere et faktisk ad-slot
4. hvis annonser blokkeres, kan `AdAccessGate` vise egen gate

Dette betyr:

- annonser er en aktiv del av driftsmodellen
- samtykke er en teknisk forutsetning for normal bruk i store deler av appen
- adblock er en brukerreise som faktisk håndteres

## Hvor annonser bør leve

Selv med aktiv annonsering skal gameplay beskyttes så langt som mulig.

Relativt gode steder:

- artikler
- temaer og huber
- infosider
- under spillsiden, men utenfor aktiv fullscreen-gameplay

Svake steder:

- inne i selve immersive kortflyten
- tett på tap-to-advance-interaksjonen
- der annonsen skaper scroll eller bryter én-skjerm-følelsen

## Privacy og consent

Samtykke lagres lokalt i nettleseren.

Dagens oppsett bruker:

- lokal lagring for spillerliste og enkelte preferanser
- lokal lagring for cookie consent
- Google Analytics og Google AdSense etter samtykke

Dette er ikke et spesielt privacy-minimalistisk oppsett, og repoet bærer selv TODO-er om å vurdere overgang til Cloudflare Web Analytics for å redusere consent-friksjon.

## Viktige begrensninger

- 18+-innhold kan gi policy-risiko for annonseplattformer
- målmarked i EØS krever reell vurdering av consent og compliance
- `ads.txt` er ikke ferdig før ekte publisher-oppsett er fullstendig på plass
- dagens annonsegate er i konflikt med ønsket om minst mulig friksjon og bør behandles som et bevisst produktvalg, ikke som “gratis”

## Anbefalt videre retning

1. hold produktet gratis og lett å starte
2. vær ærlig om at ads/consent allerede påvirker brukeropplevelsen
3. reduser friksjon der det er mulig uten å bryte driftsmodellen
4. unngå at monetisering flytter fokuset bort fra fullscreen-gameplay

Monetisering skal støtte GameNight som produkt, ikke dra det bort fra raske spilløkter og lav friksjon.
