# Monetization

## Dagens status

GameNight har lett monetiseringsstøtte, men ingen tung ad-tech eller betalingsbackend i repoet.

Det som faktisk finnes i koden:

- donasjonsknapper i UI
- klientadapter i `src/lib/donations.ts`
- annonseplassholdere via `AdBanner`
- `public/ads.txt` som placeholder

Det som ikke finnes:

- innebygd betalingsbackend
- aktiv AdSense-integrasjon
- CMP/consent-mode for annonser
- abonnement eller låste spillpakker

## Prinsipper

Monetisering skal:

- være sekundær til gameplay
- ikke gjøre spillstart tregere
- ikke bryte én-skjerm-opplevelsen
- ikke kreve konto eller paywall

## Donasjoner

Donasjon er i dag den eneste reelle integrasjonsoverflaten.

`requestDonation(amount)`:

- leser `NEXT_PUBLIC_DONATION_API_URL`
- sender `POST { amount }` til ekstern tjeneste
- forventer JSON-respons med status og eventuell checkout-URL

Hvis miljøvariabelen mangler, viser appen bare en vennlig melding om at donasjon ikke er konfigurert.

## Annonser

Repoet har bare visuelle plassholdere i dag. Det betyr:

- layouten har tenkte annonseflater
- men ingen annonsekode kjører
- gameplay skal fortsatt behandles som høyfriksjons-område for annonser

Hvis annonser legges til senere, bør prioriterte flater være:

- artikler
- temaer og huber
- info- og trust-sider

Aktiv spilling bør fortsatt skjermes så langt som mulig.

## Viktige begrensninger

- 18+-innhold kan gi policy-risiko for enkelte annonseplattformer
- målmarked i EØS krever reell vurdering av consent og compliance
- ads.txt er ikke ferdig før ekte publisher-ID er satt

## Anbefalt videre retning

1. hold produktet gratis
2. gjør SEO- og distribusjonslaget sterkere før full annonseintegrasjon
3. bruk donasjoner som lettvektsstøtte
4. vurder annonser først når plassering, policy og consent er gjennomtenkt

Monetisering skal støtte GameNight som produkt, ikke dra det bort fra raske spilløkter og lav friksjon.
