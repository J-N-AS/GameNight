
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

**Visjon:** Vi ønsker å samle de beste digitale partyspillene, reglene til klassiske drikkeleker, og morsomme musikalske utfordringer på ett og samme sted. Tjenesten skal være intuitiv, rask, og tilgjengelig på alle enheter uten behov for installasjon. På sikt skal prosjektet være selvbærende økonomisk gjennom organisk vekst og annonsering.

### 2. Nøkkelfunksjoner

-   **Bredt Spillbibliotek:** En voksende samling av spill, fra "Pekefest" og "Jeg har aldri" til unike modus som "Spinn flasken" og "Snusboksen".
-   **Artikkeldatabase:** Enkel tilgang til reglene for klassiske leker som "Beer Pong" og "Ring of Fire", optimalisert for SEO ("Thick Content").
-   **Full Offline-støtte:** Takket være PWA-teknologi kan hele appen brukes uten internettforbindelse etter første besøk.
-   **Installerbar App:** Brukere kan legge til GameNight på hjemskjermen på mobilen for en app-lignende opplevelse.
-   **Spiller-system:** Mulighet for å legge til spillernavn som dynamisk flettes inn i spilloppgavene for en personlig opplevelse.
-   **Fleksible Spillmoduser:** Systemet støtter ulike spilltyper, fra enkle kort-baserte spill til mer komplekse, fysiske leker.
-   **"Kveldens Oppsummering":** En delbar, visuell oppsummering som genereres på klientsiden etter endt spill, designet for organisk spredning på sosiale medier.

### 3. Teknisk Arkitektur (Tech Stack)

GameNight er bygget på en moderne og skalerbar stack, valgt for sin ytelse, utvikleropplevelse og lave driftskostnader.

-   **Framework:** **Next.js (App Router)** - For server-side rendering (SSR), rask sideinnlasting og god SEO.
-   **Språk:** **TypeScript** - For robust og type-sikker kode.
-   **UI-komponenter:** **ShadCN UI** - Et sett med stilige og tilgjengelige komponenter bygget på Radix UI og Tailwind CSS.
-   **Styling:** **Tailwind CSS** - For rask og konsistent styling direkte i koden.
-   **Animasjoner:** **Framer Motion** - For å skape flytende og engasjerende animasjoner.
-   **Bildegenerering (Klientside):** **html-to-image** - For å konvertere "Kveldens Oppsummering"-komponenten til et delbart bilde uten serverkostnader.
-   **PWA:** Egendefinert **Service Worker** for caching og offline-funksjonalitet.

### 4. Prosjektstruktur

Prosjektet er organisert for å være lett å vedlikeholde og utvide.

-   `src/app/`: Hovedstrukturen for Next.js-appen, med sider og ruter.
-   `src/components/`: Gjenbrukbare React-komponenter som utgjør brukergrensesnittet.
-   `src/data/`: **Hjertet av innholdet.** Alle spill, artikler og temaer ligger her som enkle `.json`-filer. Dette gjør det ekstremt enkelt å legge til nytt innhold uten å endre koden.
-   `src/lib/`: Kjernefunksjonalitet, inkludert `games.ts`, `articles.ts` og `themes.ts` som laster og behandler data fra `data`-mappen.
-   `public/`: Statiske filer, inkludert bilder, `manifest.json` (for PWA), `robots.txt`, `llms.txt` og den kritiske `sw.js` (Service Worker).
-   `SPILL_OVERSIKT.md`: En autogenerert oversikt over alle spill og antall oppgaver i hver.

### 5. Forretningsmodell: Hosting og Inntekter

**Hosting:**
Prosjektet er designet for å kjøre på **Firebase Hosting**. Dette valget er strategisk på grunn av:
-   **Generøs gratis-kvote:** Firebase tilbyr en betydelig mengde gratis trafikk og lagring, noe som gjør det mulig å drifte siden tilnærmet kostnadsfritt.
-   **Skalerbarhet:** Ved økt trafikk skalerer tjenesten automatisk ("pay-as-you-go").
-   **Globalt CDN:** Innhold leveres raskt til brukere over hele verden.

**Inntektsmodell:**
Hovedstrategien er å bruke **Google AdSense**.
-   **Mål:** Målet er ikke nødvendigvis å skape stor profitt, men primært å **dekke driftskostnadene** (server, domene etc.) slik at prosjektet kan forbli gratis for brukerne.
-   **AdSense-strategi og Innholdsbalanse:** Siden spillene har drikking som et tema, er det en iboende risiko knyttet til AdSense's retningslinjer. For å minimere denne risikoen er følgende tiltak iverksatt:
    -   **"AdSense-vask":** Direkte oppfordringer til drikking er systematisk byttet ut med tryggere formuleringer som "ta en straff" eller "utfør en skål".
    -   **Ansvarlighetsfraskrivelse:** Nettstedet har en tydelig oppfordring om ansvarlig drikking i bunnteksten.
    -   **Aldersmerking og Advarsler:** Spill med dristig innhold er tydelig merket "18+" og har en egen advarselsskjerm.
    -   **Smart Sortering:** "Alle Spill"-listen er intelligent sortert for å vise familievennlige spill først, mens de mer "spicy" spillene ligger lenger nede.

### 6. Markedsføring: Organisk Vekst

I stedet for betalt markedsføring, fokuserer prosjektet på innebygde, organiske vekstmekanismer.

-   **"Kveldens Oppsummering":** Dette er prosjektets viktigste markedsføringsverktøy. Etter endt spill genereres et stilig, delbart bilde på klientsiden.
    -   **Viralt Potensial:** Brukere kan enkelt dele oppsummeringen til Snapchat- eller Instagram-stories. Hver deling fungerer som en personlig anbefaling og organisk reklame for GameNight.
    -   **Kostnadseffektivt:** Siden bildegenereringen skjer 100 % i brukerens nettleser, påløper det ingen serverkostnader for denne funksjonen.

### 7. SEO og AI-optimalisering

For å maksimere synlighet i søkemotorer og forberede for fremtiden, er følgende implementert:

-   **Dynamisk Sitemap (`sitemap.ts`):** Genererer automatisk en `sitemap.xml` som inkluderer alle statiske sider, spill, artikler og temasider.
-   **"Thick Content":** Ved å bygge ut artikkeldatabasen med komplette guider til klassiske leker (som Beer Pong, Tre-Mann etc.), skaper vi innholdsrike sider som rangerer godt på relevante søkeord.
-   **`robots.txt` og `llms.txt`:** Standardiserte filer som gir instrukser til søkemotorer og AI-modeller.
-   **Server-Side Rendering (SSR):** Sikrer at alt innhold er optimalt for indeksering.

### 8. PWA og Offline-først

GameNight er bygget som en **Progressive Web App (PWA)**, med et sterkt fokus på offline-funksjonalitet.

-   **Service Worker (`sw.js`):** Cacher alle nødvendige ressurser, inkludert applikasjonsskallet, spilldata (`.json`-filer) og bilder.
-   **Resultat:** Etter første besøk fungerer hele nettstedet sømløst **uten internettforbindelse**, noe som er kritisk for bruk i situasjoner med dårlig dekning.
-   **Installerbar:** Brukere får et forslag om å "Installere GameNight" for enkel tilgang fra hjemskjermen.

### 9. Spillmekanikk og Innhold

Systemet er bygget for å være fleksibelt med ulike spilltyper, definert av `gameType` i spillenes JSON-filer.

-   `default`: Standard kort-basert spill.
-   `versus`: Lag-mot-lag spill der spillere stemmer.
-   `spin-the-bottle`: Spill som bruker enten en virtuell eller ekte flaske.
-   `physical-item`: Spill som krever en fysisk gjenstand, med dedikerte instruksjoner (f.eks. "Snusboksen").
    -   **Utvidet Konsept:** "Snusboksen" er bygget ut med spesialiserte versjoner (`-sannhet` og `-utfordring`) for å gjøre denne unike mekanikken enda mer engasjerende.

Innholdet er lett å administrere via JSON-filer, noe som gjør det enkelt å lansere nye spillpakker og oppdatere eksisterende.

### 10. Filosofi og Fremtidsvisjoner

GameNight er et **lidenskapsprosjekt** utviklet på fritiden. Dette preger filosofien:

-   **Brukerfokus:** Målet er å skape noe genuint morsomt og nyttig. Kvalitet og brukeropplevelse trumfer alt.
-   **Bærekraftig vekst:** Utvikling skjer når tid og inspirasjon strekker til. Forretningsmodellen er designet for å støtte prosjektet, ikke for å maksimere profitt.
-   **Fellesskap:** Tilbakemeldinger og spill-ideer fra brukere er høyt verdsatt og en viktig drivkraft.
-   **Transparens:** Vi er åpne om hvordan prosjektet driftes og finansieres, noe som bygger tillit.

Ved å kombinere en solid teknisk plattform med en klar visjon og en bærekraftig driftsmodell, har GameNight som mål å bli en varig og verdsatt ressurs for sosiale lag i Norge.
