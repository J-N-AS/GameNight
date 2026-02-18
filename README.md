
# GameNight: Den Komplette Guiden til Prosjektet

Velkommen til GameNight-prosjektet! Dette dokumentet gir en grundig oversikt over prosjektets mål, tekniske arkitektur, forretningsstrategi og fremtidsvisjoner. Målet er å fungere som en sentral informasjonskilde for utvikling og strategiske diskusjoner.

## Innholdsfortegnelse

1.  [Prosjektets Mål og Visjon](#1-prosjektets-mål-og-visjon)
2.  [Nøkkelfunksjoner](#2-nøkkelfunksjoner)
3.  [Teknisk Arkitektur (Tech Stack)](#3-teknisk-arkitektur-tech-stack)
4.  [Prosjektstruktur](#4-prosjektstruktur)
5.  [Forretningsmodell: Hosting og Inntekter](#5-forretningsmodell-hosting-og-inntekter)
6.  [SEO og AI-optimalisering](#6-seo-og-ai-optimalisering)
7.  [PWA og Offline-først](#7-pwa-og-offline-først)
8.  [Spillmekanikk og Innhold](#8-spillmekanikk-og-innhold)
9.  [Filosofi og Fremtidsvisjoner](#9-filosofi-og-fremtidsvisjoner)

---

### 1. Prosjektets Mål og Visjon

**Mål:** Å skape den ultimate, nettleserbaserte destinasjonen for sosiale spill i Norge. GameNight skal være en "digital verktøykasse" for enhver festlig anledning, enten det er vorspiel, en rolig kveld med venner, eller en større sammenkomst.

**Visjon:** Vi ønsker å samle de beste digitale partyspillene, reglene til klassiske drikkeleker, og morsomme musikalske utfordringer på ett og samme sted. Tjenesten skal være intuitiv, rask, og tilgjengelig på alle enheter uten behov for installasjon. På sikt skal prosjektet være selvbærende økonomisk.

### 2. Nøkkelfunksjoner

-   **Bredt Spillbibliotek:** En voksende samling av spill, fra "Pekefest" og "Jeg har aldri" til unike modus som "Spinn flasken" og "Snusboksen".
-   **Artikkeldatabase:** Enkel tilgang til reglene for klassiske leker som "Beer Pong" og "Ring of Fire".
-   **Full Offline-støtte:** Takket være PWA-teknologi (Progressive Web App) kan hele appen brukes uten internettforbindelse etter første besøk.
-   **Installerbar App:** Brukere kan legge til GameNight på hjemskjermen på mobilen for en app-lignende opplevelse.
-   **Spiller-system:** Mulighet for å legge til spillernavn som dynamisk flettes inn i spilloppgavene.
-   **Fleksible Spillmoduser:** Systemet støtter ulike spilltyper, fra enkle kort-baserte spill til mer komplekse, fysiske leker.

### 3. Teknisk Arkitektur (Tech Stack)

GameNight er bygget på en moderne og skalerbar stack, valgt for sin ytelse, utvikleropplevelse og lave driftskostnader.

-   **Framework:** **Next.js (App Router)** - For server-side rendering (SSR), rask sideinnlasting og god SEO.
-   **Språk:** **TypeScript** - For robust og type-sikker kode.
-   **UI-komponenter:** **ShadCN UI** - Et sett med stilige og tilgjengelige komponenter bygget på Radix UI og Tailwind CSS.
-   **Styling:** **Tailwind CSS** - For rask og konsistent styling direkte i koden.
-   **Animasjoner:** **Framer Motion** - For å skape flytende og engasjerende animasjoner.
-   **PWA:** Egendefinert **Service Worker** for caching og offline-funksjonalitet.

### 4. Prosjektstruktur

Prosjektet er organisert for å være lett å vedlikeholde og utvide.

-   `src/app/`: Hovedstrukturen for Next.js-appen, med sider og ruter.
-   `src/components/`: Gjenbrukbare React-komponenter som utgjør brukergrensesnittet.
-   `src/data/`: **Hjertet av innholdet.** Alle spill og artikler ligger her som enkle `.json`-filer. Dette gjør det ekstremt enkelt å legge til nye spill, oppgaver eller redigere eksisterende innhold uten å endre koden.
-   `src/lib/`: Kjernefunksjonalitet, inkludert `games.ts` og `articles.ts` som laster og behandler data fra `data`-mappen.
-   `public/`: Statiske filer, inkludert bilder, `manifest.json` (for PWA), `robots.txt`, `llms.txt` og den kritiske `sw.js` (Service Worker).

### 5. Forretningsmodell: Hosting og Inntekter

**Hosting:**
Prosjektet er designet for å kjøre på **Firebase Hosting**. Dette valget er strategisk på grunn av:
-   **Generøs gratis-kvote:** Firebase tilbyr en betydelig mengde gratis trafikk og lagring, noe som gjør det mulig å drifte siden tilnærmet kostnadsfritt i startfasen.
-   **Skalerbarhet:** Ved økt trafikk skalerer tjenesten automatisk, og man betaler kun for det man bruker ("pay-as-you-go").
-   **Globalt CDN:** Innhold leveres raskt til brukere over hele verden.

**Inntektsmodell:**
Hovedstrategien er å bruke **Google AdSense**.
-   **Mål:** Målet er ikke nødvendigvis å skape stor profitt, men primært å **dekke driftskostnadene** (server, domene etc.) slik at prosjektet kan forbli gratis for brukerne. Et eventuelt overskudd vil bli reinvestert i videre utvikling.
-   **Transparens:** "Om oss"-siden kommuniserer åpent at annonser brukes for å holde tjenesten gratis, noe som bygger tillit.
-   **AdSense-strategi og Innholdsrisiko:** Siden spillene har drikking som et sentralt tema, er det en iboende risiko knyttet til Google AdSense's retningslinjer for alkoholrelatert innhold. For å minimere denne risikoen og fremstå som en ansvarlig plattform, er følgende tiltak iverksatt:
    -   **Aldersgrenser:** Spill med dristig eller voksent innhold er tydelig merket "18+" og har en egen advarselsskjerm som krever aktivt samtykke.
    -   **Ansvarlighetsfraskrivelse:** Nettstedet har en tydelig og detaljert oppfordring om ansvarlig drikking i bunnteksten på hver side.
    -   **Fokus på det sosiale:** Kommunikasjonen rundt spillene fokuserer på det sosiale aspektet – samhold, latter og gode samtaler – fremfor selve drikkingen.

### 6. SEO og AI-optimalisering

For å maksimere synlighet i søkemotorer og forberede for fremtiden, er følgende implementert:

-   **Dynamisk Sitemap (`sitemap.ts`):** Genererer automatisk en `sitemap.xml` som inkluderer alle statiske sider, spill og artikler. Dette gir Google et komplett kart over alt innhold.
-   **`robots.txt`:** En standardisert fil som gir søkemotorer instruksjoner om hvordan de skal gjennomsøke siden. Den peker også til sitemap.
-   **`llms.txt`:** En ny og fremtidsrettet fil som eksplisitt gir tillatelse til AI-modeller (som Googles Gemini) til å bruke innholdet på siden. Dette kan forbedre synligheten i AI-drevne søk og interaksjoner.
-   **Server-Side Rendering (SSR):** Next.js sørger for at alt innhold er renderet på serveren, noe som er optimalt for indeksering.

### 7. PWA og Offline-først

GameNight er bygget som en **Progressive Web App (PWA)**, med et sterkt fokus på offline-funksjonalitet.

-   **Service Worker (`sw.js`):** En egendefinert service worker fanger opp nettverksforespørsler og lagrer alle nødvendige ressurser i en cache. Dette inkluderer:
    -   Selve applikasjonsskallet.
    -   **Alle `.json`-filer** med spill- og artikkeldata.
    -   Alle bilder og logoer brukt i artikler og layout.
-   **Resultat:** Etter første besøk fungerer hele nettstedet sømløst **uten internettforbindelse**. Dette er en kritisk funksjon for bruk i situasjoner med dårlig dekning (hytter, parker etc.).
-   **Installerbar:** `manifest.json` og service-workeren gjør at brukere på mobil får et forslag om å "Installere GameNight" for enkel tilgang fra hjemskjermen.

### 8. Spillmekanikk og Innhold

Systemet er bygget for å være fleksibelt med ulike spilltyper, definert av `gameType` i spillenes JSON-filer.

-   `default`: Standard kort-basert spill (f.eks. "Vorspiel Mix").
-   `versus`: Lag-mot-lag spill der spillere stemmer (f.eks. "Girls vs Boys").
-   `spin-the-bottle`: Spill som bruker enten en virtuell, animert flaske eller er tilpasset bruk av en ekte flaske.
-   `physical-item`: Spill som krever en fysisk gjenstand, med en dedikert instruksjonsskjerm (f.eks. "Snusboksen").

Innholdet er lett å administrere via JSON-filer, noe som gjør det enkelt å lansere nye spillpakker og oppdatere eksisterende.

### 9. Filosofi og Fremtidsvisjoner

GameNight er et **lidenskapsprosjekt** utviklet på fritiden. Dette preger filosofien:

-   **Brukerfokus:** Målet er å skape noe genuint morsomt og nyttig. Kvalitet og brukeropplevelse trumfer alt.
-   **Bærekraftig vekst:** Utvikling skjer når tid og inspirasjon strekker til. Forretningsmodellen er designet for å støtte prosjektet, ikke for å maksimere profitt. Dette er ikke en "laget for AdSense"-side, men et ekte produkt.
-   **Fellesskap:** Selv om det ikke er open source per nå, er tilbakemeldinger og spill-ideer fra brukere høyt verdsatt og en viktig drivkraft for videre utvikling.
-   **Transparens:** Vi er åpne om hvordan prosjektet driftes og finansieres, noe som bygger tillit hos brukerne.

Ved å kombinere en solid teknisk plattform med en klar visjon og en bærekraftig driftsmodell, har GameNight som mål å bli en varig og verdsatt ressurs for sosiale lag i Norge.
