# GameNight: Den Komplette Guiden til Prosjektet

Velkommen til GameNight-prosjektet! Dette dokumentet gir en grundig oversikt over prosjektets mål, tekniske arkitektur, forretningsstrategi og fremtidsvisjoner. Målet er å fungere som en sentral informasjonskilde for utvikling og strategiske diskusjoner.

## Innholdsfortegnelse

1.  [Prosjektets Mål og Visjon](#1-prosjektets-mål-og-visjon)
2.  [Nøkkelfunksjoner](#2-nøkkelfunksjoner)
3.  [Teknisk Arkitektur (Tech Stack)](#3-teknisk-arkitektur-tech-stack)
4.  [Prosjektstruktur & Innholdsstrategi](#4-prosjektstruktur--innholdsstrategi)
5.  [Forretningsmodell: Hosting og Inntekter](#5-forretningsmodell-hosting-og-inntekter)
6.  [Markedsføring: Organisk Vekst](#6-markedsføring-organisk-vekst)
7.  [SEO og "Thick Content"](#7-seo-og-thick-content)
8.  [PWA og Offline-først](#8-pwa-og-offline-først)
9.  [Spillmekanikk og Innhold](#9-spillmekanikk-og-innhold)
10. [Filosofi og Fremtidsvisjoner](#10-filosofi-og-fremtidsvisjoner)

---

### 1. Prosjektets Mål og Visjon

**Mål:** Å skape den ultimate, nettleserbaserte destinasjonen for sosiale spill i Norge. GameNight skal være en "digital verktøykasse" for enhver festlig anledning, enten det er vorspiel, en rolig kveld med venner, eller en større sammenkomst.

**Visjon:** Vi ønsker å samle de beste digitale partyspillene, reglene til klassiske drikkeleker, og morsomme musikalske utfordringer på ett og samme sted. Tjenesten skal være intuitiv, rask, og tilgjengelig på alle enheter uten behov for installasjon. På sikt skal prosjektet være selvbærende økonomisk gjennom organisk vekst og inntekter.

### 2. Nøkkelfunksjoner

-   **Bredt Spillbibliotek:** En voksende samling av spill, fra "Pekefest" og "Jeg har aldri" til unike modus som "Spinn flasken" og "Snusboksen".
-   **Artikkeldatabase:** Enkel tilgang til reglene for klassiske leker som "Beer Pong" og "Ring of Fire", optimalisert for SEO.
-   **Full Offline-støtte:** Takket være PWA-teknologi kan hele appen brukes uten internettforbindelse etter første besøk.
-   **Installerbar App:** Brukere kan legge til GameNight på hjemskjermen på mobilen for en app-lignende opplevelse.
-   **Globalt Spiller-system:** Et avansert system som holder styr på spillere og statistikk (`timesTargeted`, `tasksCompleted`, `penalties`) gjennom en hel kveld, på tvers av flere spill.
-   **"Kveldens Oppsummering":** En delbar, visuell oppsummering som genereres på klientsiden etter endt kveld. Den viser morsomme kåringer basert på statistikk og har valgbare temaer for å maksimere viral spredning på sosiale medier.
-   **Vipps-donasjoner:** En fullt integrert, men valgfri, løsning for å motta donasjoner via Vipps for å støtte prosjektet.
-   **Dedikerte Hub-sider:** Spesialbygde landingssider for store anledninger som `/fadderuka` og `/russetiden` for å tiltrekke målrettet trafikk.
-   **Custom Spill for Russegrupper:** Mulighet for russegrupper til å bestille sitt eget, skreddersydde spill med interne vitser og eget design.

### 3. Teknisk Arkitektur (Tech Stack)

GameNight er bygget på en moderne og skalerbar stack, valgt for sin ytelse, utvikleropplevelse og lave driftskostnader.

-   **Framework:** **Next.js (App Router)** - For server-side rendering (SSR), rask sideinnlasting og god SEO.
-   **Språk:** **TypeScript** - For robust og type-sikker kode.
-   **UI-komponenter:** **ShadCN UI** - Et sett med stilige og tilgjengelige komponenter bygget på Radix UI og Tailwind CSS.
-   **Styling:** **Tailwind CSS** - For rask og konsistent styling direkte i koden.
-   **Animasjoner:** **Framer Motion** - For å skape flytende og engasjerende animasjoner.
-   **State Management:** **React Context** + `localStorage` - For å håndtere den globale spill-økta (spillere og statistikk).
-   **Bildegenerering (Klientside):** **html-to-image** - For å konvertere "Kveldens Oppsummering"-komponenten til et delbart bilde uten serverkostnader.
-   **Betaling:** Egen backend API-rute som bruker **Vipps ePayment API** for sikker håndtering av donasjoner.
-   **PWA:** Egendefinert **Service Worker** for caching og offline-funksjonalitet.
-   **QR-koder:** **react-qr-code** for å generere QR-koder i promo-generatoren.
-   **Konfetti:** **react-confetti** for en feirende effekt på oppsummeringssiden.

### 4. Prosjektstruktur & Innholdsstrategi

Prosjektet er organisert for å være lett å vedlikeholde og utvide.

-   `src/app/`: Hovedstrukturen for Next.js-appen, inkludert sider (`/`, `/spill/[gameId]`), API-ruter (`/api/vipps/donate`) og layouts. Inneholder også dedikerte hub-sider som `/fadderuka` og `/russetiden`.
-   `src/components/`: Gjenbrukbare React-komponenter, inkludert spillkomponenter (`GameFlow`, `TaskCard`), UI-elementer og den globale oppsummeringsskjermen.
-   **`src/data/` - Hjertet av innholdet:** Alt innhold administreres via enkle JSON-filer, noe som gjør det ekstremt lett å legge til nye spill og artikler.
    -   **Spill (`[spill-id].json`):** Hvert spill har sin egen fil. Strukturen er som følger:
        -   `id`: Unik identifikator (må matche filnavn).
        -   `title`, `description`, `emoji`: Visuell informasjon.
        -   `intensity`, `audience`, `category`, `tags`: For filtrering og kategorisering.
        -   `requiresPlayers`: `true` hvis spillere må legges til.
        -   `items`: En liste med oppgave-objekter (`{ "type": "...", "text": "..." }`).
        -   `gameType`: Definerer spillmekanikken (`default`, `versus`, `spin-the-bottle`, `physical-item`).
        -   `warning`: Viser en advarselsskjerm for 18+ innhold.
        -   `custom`, `isHiddenFromMain`, `region`, `kommune`: For skreddersydde spill (f.eks. for russegrupper).
    -   `drikkeleker.json`: Artikler om klassiske drikkeleker for SEO.
    -   `musikkleker.json`, `screen-games.json`: Lister over spill for spesifikke anledninger.
    -   `themes.json`: Definerer tema-sidene som kuraterer lister med spill.
-   `src/lib/`: Kjernefunksjonalitet for lasting og behandling av data fra `src/data/`.
-   `src/hooks/`: Egendefinerte React-hooks (`useSession` for spillerdata).
-   `public/`: Statiske filer, inkludert bilder, logoer, `manifest.json`, `sw.js` og `vipps-button.svg`.
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
    -   **Frontend:** En enkel `Button`-komponent med en SVG-illustrasjon (`vipps-button.svg`) sender en sikker `POST`-forespørsel til vårt eget backend-endepunkt med ønsket beløp.
    -   **Backend (Next.js API Route):** En dedikert API-rute på `/api/vipps/donate` fungerer som en sikker mellomstasjon.
        1.  **Validering:** Ruten sjekker først om Vipps-miljøvariablene (`VIPPS_CLIENT_ID`, `VIPPS_CLIENT_SECRET` etc.) er satt.
        2.  **Autentisering:** Ruten henter et `access_token` fra Vipps ved å bruke de hemmelige nøklene som er lagret trygt på serveren.
        3.  **Betalingsopprettelse:** Med tokenet oppretter ruten en ny betaling via Vipps ePayment API og returnerer en unik `redirectUrl` til frontend.
    -   **Sikkerhet:** Alle hemmelige nøkler og API-kall til Vipps skjer utelukkende på server-siden. Ingen sensitiv informasjon eksponeres noensinne i klientkoden.
    -   **Konfigurasjon:** Alt styres via `.env`-filen. Ved å fylle ut `VIPPS_CLIENT_ID`, `VIPPS_CLIENT_SECRET`, `VIPPS_SUB_KEY`, `VIPPS_MSN` og `VIPPS_ENVIRONMENT`, aktiveres donasjonsflyten automatisk.

### 6. Markedsføring: Organisk Vekst

I stedet for betalt markedsføring, fokuserer prosjektet på innebygde, organiske vekstmekanismer.

-   **"Kveldens Oppsummering":** Dette er prosjektets viktigste markedsføringsverktøy. Etter endt kveld genereres et stilig, delbart bilde med "Spotify Wrapped"-estetikk, komplett med valgbare temaer.
    -   **Viralt Potensial:** Brukere kan enkelt dele et personlig og morsomt sammendrag til Snapchat- eller Instagram-stories. Hver deling fungerer som en personlig anbefaling.
    -   **Kostnadseffektivt:** Siden bildegenereringen skjer 100 % i brukerens nettleser med `html-to-image`, påløper det ingen serverkostnader.
-   **Viral-loop for Russegrupper:** Den innebygde promo-generatoren lar russegrupper lage og laste ned egne bilder med QR-koder som peker direkte til deres spill. Dette oppfordrer til deling i sosiale medier og på trykksaker (russedress/russekort).

### 7. SEO og "Thick Content"

-   **Dynamisk Sitemap (`sitemap.ts`):** Genererer automatisk en `sitemap.xml` som inkluderer alle sider, spill, artikler og temaer for optimal indeksering.
-   **"Thick Content":** Artikkeldatabasen med komplette guider til klassiske leker (`/drikkeleker`), samt spesialbygde hub-sider som `/fadderuka` og `/russetiden`, skaper innholdsrike sider som rangerer godt på relevante søkeord.
-   **Server-Side Rendering (SSR):** Sikrer at alt innhold er optimalt for indeksering av søkemotorer.

### 8. PWA og Offline-først

GameNight er bygget som en **Progressive Web App (PWA)**, med et sterkt fokus på offline-funksjonalitet. Etter første besøk fungerer hele nettstedet sømløst **uten internettforbindelse**, takket være en custom service worker som cacher alle nødvendige ressurser.

### 9. Spillmekanikk og Innhold

-   **Global Økt-statistikk:** Systemet sporer spillerstatistikk (`timesTargeted`, `tasksCompleted`, `penalties`) på tvers av alle spill som spilles i løpet av en kveld, takket være en global React Context-provider.
-   **Fleksible Spilltyper:** Systemet støtter ulike `gameType` for variert mekanikk:
    -   `default`: Standard kort-spill.
    -   `versus`: Lag-mot-lag med poengsystem.
    -   `spin-the-bottle`: Bruker en virtuell eller ekte flaske.
    -   `physical-item`: Krever at en fysisk gjenstand sendes rundt.
-   **Enkel Innholdsadministrasjon:** Alt innhold administreres via enkle JSON-filer, noe som gjør det ekstremt lett å legge til nye spill, oppgaver og artikler.

### 10. Filosofi og Fremtidsvisjoner

GameNight er et **lidenskapsprosjekt**. Kvalitet og brukeropplevelse trumfer alt. Forretningsmodellen er designet for å støtte prosjektet, ikke for å maksimere profitt. Ved å kombinere en solid teknisk plattform med en klar visjon, har GameNight som mål å bli en varig og verdsatt ressurs for sosiale lag i Norge.
