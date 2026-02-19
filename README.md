
# GameNight: Den Komplette Guiden til Prosjektet

Velkommen til GameNight-prosjektet! Dette dokumentet gir en grundig oversikt over prosjektets mål, tekniske arkitektur, forretningsstrategi og fremtidsvisjoner. Målet er å fungere som en sentral informasjonskilde for utvikling og strategiske diskusjoner.

## Innholdsfortegnelse

1.  [Prosjektets Mål og Visjon](#1-prosjektets-mål-og-visjon)
2.  [Nøkkelfunksjoner](#2-nøkkelfunksjoner)
3.  [Teknisk Arkitektur (Tech Stack)](#3-teknisk-arkitektur-tech-stack)
4.  [Prosjektstruktur](#4-prosjektstruktur)
5.  [Forretningsmodell: Hosting og Inntekter](#5-forretningsmodell-hosting-og-inntekter)
6.  [Markedsføring: Organisk Vekst](#6-markedsføring-organisk-vekst)
7.  [SEO og AI-optimalisering](#7-seo-og-ai-optimalisering)
8.  [PWA og Offline-først](#8-pwa-og-offline-først)
9.  [Spillmekanikk og Innhold](#9-spillmekanikk-og-innhold)
10. [Filosofi og Fremtidsvisjoner](#10-filosofi-og-fremtidsvisjoner)

---

### 1. Prosjektets Mål og Visjon

**Mål:** Å skape den ultimate, nettleserbaserte destinasjonen for sosiale spill i Norge. GameNight skal være en "digital verktøykasse" for enhver festlig anledning, enten det er vorspiel, en rolig kveld med venner, eller en større sammenkomst.

**Visjon:** Vi ønsker å samle de beste digitale partyspillene, reglene til klassiske drikkeleker, og morsomme musikalske utfordringer på ett og samme sted. Tjenesten skal være intuitiv, rask, og tilgjengelig på alle enheter uten behov for installasjon. På sikt skal prosjektet være selvbærende økonomisk gjennom organisk vekst og inntekter.

### 2. Nøkkelfunksjoner

-   **Bredt Spillbibliotek:** En voksende samling av spill, fra "Pekefest" og "Jeg har aldri" til unike modus som "Spinn flasken" og "Snusboksen".
-   **Artikkeldatabase:** Enkel tilgang til reglene for klassiske leker som "Beer Pong" og "Ring of Fire", optimalisert for SEO ("Thick Content").
-   **Full Offline-støtte:** Takket være PWA-teknologi kan hele appen brukes uten internettforbindelse etter første besøk.
-   **Installerbar App:** Brukere kan legge til GameNight på hjemskjermen på mobilen for en app-lignende opplevelse.
-   **Globalt Spiller-system:** Et avansert system som holder styr på spillere og statistikk (f.eks. antall fullførte oppgaver, straffer) gjennom en hel kveld, på tvers av flere spill.
-   **"Kveldens Oppsummering":** En delbar, visuell oppsummering som genereres på klientsiden etter endt kveld. Den viser morsomme kåringer basert på statistikk samlet inn i løpet av økten (f.eks. "Kveldens MVP"), designet for organisk spredning på sosiale medier.
-   **Vipps-donasjoner:** En fullt integrert, men valgfri, løsning for å motta donasjoner via Vipps for å støtte prosjektet.

### 3. Teknisk Arkitektur (Tech Stack)

GameNight er bygget på en moderne og skalerbar stack, valgt for sin ytelse, utvikleropplevelse og lave driftskostnader.

-   **Framework:** **Next.js (App Router)** - For server-side rendering (SSR), rask sideinnlasting og god SEO.
-   **Språk:** **TypeScript** - For robust og type-sikker kode.
-   **UI-komponenter:** **ShadCN UI** - Et sett med stilige og tilgjengelige komponenter bygget på Radix UI og Tailwind CSS.
-   **Styling:** **Tailwind CSS** - For rask og konsistent styling direkte i koden.
-   **Animasjoner:** **Framer Motion** - For å skape flytende og engasjerende animasjoner.
-   **State Management:** **React Context** - For å håndtere den globale spill-økta (spillere og statistikk).
-   **Bildegenerering (Klientside):** **html-to-image** - For å konvertere "Kveldens Oppsummering"-komponenten til et delbart bilde uten serverkostnader.
-   **Betaling:** **Vipps MobilePay Checkout** - For en sømløs og sikker donasjonsopplevelse.
-   **PWA:** Egendefinert **Service Worker** for caching og offline-funksjonalitet.

### 4. Prosjektstruktur

Prosjektet er organisert for å være lett å vedlikeholde og utvide.

-   `src/app/`: Hovedstrukturen for Next.js-appen, inkludert sider, API-ruter (`/api/vipps/donate`) og layouts.
-   `src/components/`: Gjenbrukbare React-komponenter, inkludert spillkomponenter, UI-elementer og den globale oppsummeringsskjermen.
-   `src/data/`: **Hjertet av innholdet.** Alle spill, artikler og temaer ligger her som enkle `.json`-filer.
-   `src/lib/`: Kjernefunksjonalitet for lasting og behandling av data.
-   `src/hooks/`: Egendefinerte React-hooks for å hente spillerdata og annen logikk.
-   `public/`: Statiske filer, inkludert bilder, `manifest.json` og `sw.js`.
-   `.env`: Fil for miljøvariabler, inkludert hemmelige nøkler for Vipps.

### 5. Forretningsmodell: Hosting og Inntekter

**Hosting:**
Prosjektet er designet for å kjøre på **Firebase Hosting** på grunn av den generøse gratis-kvoten og enkle skalerbarheten.

**Inntektsmodell:**
Modellen er todelt: annonser for å dekke løpende kostnader og valgfrie donasjoner for å støtte videreutvikling.

**1. Annonser (Google AdSense):**
For å minimere risikoen knyttet til AdSense's retningslinjer for innhold om drikking, har vi utført en "AdSense-vask" der direkte oppfordringer er byttet ut med tryggere formuleringer. Vi har også en tydelig ansvarsfraskrivelse i bunnteksten.

**2. Donasjoner (Vipps ePayment API):**
Vi har implementert en komplett og sikker løsning for å motta donasjoner via Vipps.

-   **Arkitektur:**
    -   **Frontend:** Vi bruker den offisielle `<vipps-mobilepay-button>`-webkomponenten. En `handleDonate`-funksjon sender en sikker `POST`-forespørsel til vårt eget backend-endepunkt.
    -   **Backend (Next.js API Route):** En dedikert API-rute på `/api/vipps/donate` fungerer som en sikker mellomstasjon.
        1.  **Validering:** Ruten sjekker først om Vipps-miljøvariablene (`VIPPS_CLIENT_ID`, `VIPPS_CLIENT_SECRET` etc.) er satt. Hvis ikke, returneres en `not_configured`-status, og frontend viser en vennlig melding til brukeren.
        2.  **Autentisering:** Ruten henter et `access_token` fra Vipps ved å bruke de hemmelige nøklene som er lagret trygt på serveren.
        3.  **Betalingsopprettelse:** Med tokenet oppretter ruten en ny betaling via Vipps ePayment API og returnerer en unik `checkoutFrontendUrl` til frontend.
    -   **Sikkerhet:** Alle hemmelige nøkler og API-kall til Vipps skjer utelukkende på server-siden. Ingen sensitiv informasjon eksponeres noensinne i klientkoden.
    -   **Konfigurasjon:** Alt styres via `.env`-filen. Ved å fylle ut `VIPPS_CLIENT_ID`, `VIPPS_CLIENT_SECRET`, `VIPPS_SUB_KEY`, `VIPPS_MSN` og `VIPPS_ENVIRONMENT`, aktiveres donasjonsflyten automatisk.

### 6. Markedsføring: Organisk Vekst

I stedet for betalt markedsføring, fokuserer prosjektet på innebygde, organiske vekstmekanismer.

-   **"Kveldens Oppsummering":** Dette er prosjektets viktigste markedsføringsverktøy. Etter endt kveld genereres et stilig, delbart bilde basert på ekte statistikk fra spilløkten.
    -   **Viralt Potensial:** Brukere kan enkelt dele et personlig og morsomt sammendrag til Snapchat- eller Instagram-stories. Hver deling fungerer som en personlig anbefaling og organisk reklame for GameNight.
    -   **Kostnadseffektivt:** Siden bildegenereringen skjer 100 % i brukerens nettleser, påløper det ingen serverkostnader.

### 7. SEO og AI-optimalisering

-   **Dynamisk Sitemap (`sitemap.ts`):** Genererer automatisk en `sitemap.xml` som inkluderer alle sider.
-   **"Thick Content":** Artikkeldatabasen med komplette guider til klassiske leker skaper innholdsrike sider som rangerer godt.
-   **Server-Side Rendering (SSR):** Sikrer at alt innhold er optimalt for indeksering.

### 8. PWA og Offline-først

GameNight er bygget som en **Progressive Web App (PWA)**, med et sterkt fokus på offline-funksjonalitet. Etter første besøk fungerer hele nettstedet sømløst **uten internettforbindelse**.

### 9. Spillmekanikk og Innhold

-   **Global Økt-statistikk:** Systemet sporer nå spillerstatistikk (antall ganger valgt, fullførte oppgaver, straffer) på tvers av alle spill som spilles i løpet av en kveld.
-   **Fleksible Spilltyper:** Systemet støtter ulike `gameType`, fra standard kort-spill (`default`) og lag-mot-lag (`versus`) til spill som krever en fysisk gjenstand (`physical-item`).
-   **Enkel Innholdsadministrasjon:** Alt innhold administreres via enkle JSON-filer i `src/data/`-mappen, noe som gjør det ekstremt lett å legge til nye spill.

### 10. Filosofi og Fremtidsvisjoner

GameNight er et **lidenskapsprosjekt**. Kvalitet og brukeropplevelse trumfer alt. Forretningsmodellen er designet for å støtte prosjektet, ikke for å maksimere profitt. Ved å kombinere en solid teknisk plattform med en klar visjon, har GameNight som mål å bli en varig og verdsatt ressurs for sosiale lag i Norge.
