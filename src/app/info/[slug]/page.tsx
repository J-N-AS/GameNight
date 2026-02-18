'use client';

import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Mail, Gamepad2, Library, Music, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdBanner } from '@/components/ads/AdBanner';

const pages: { [key: string]: { title: string; content: React.ReactNode } } = {
  'om-oss': {
    title: 'Vårt Mål: Mer Moro, Mindre Styr',
    content: (
      <div className="space-y-8 text-muted-foreground">
        <div className="space-y-4 text-lg">
          <p>
            GameNight ble startet med én enkel idé: Å gjøre det lettere å ha det gøy sammen. Vi ønsker å være din digitale verktøykasse for enhver festlig anledning, enten det er vorspiel, parkheng eller en rolig kveld med venner.
          </p>
          <p className="font-semibold text-foreground">
            Målet vårt er å samle de beste digitale partyspillene, klassiske drikkelekene og morsomme musikalske utfordringer – alt på ett sted og rett i nettleseren din.
          </p>
        </div>

        <div className="space-y-6">
            <h3 className="font-semibold text-foreground text-2xl text-center">Hva finner du på GameNight?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="rounded-lg border border-border bg-card/50 p-4">
                    <Gamepad2 className="mx-auto h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold text-foreground">Digitale Spill</h4>
                    <p className="text-sm">Interaktive spill som "Pekefest" og "Spinn flasken", klare til å spilles direkte på skjermen.</p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                    <Library className="mx-auto h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold text-foreground">Klassiske Drikkeleker</h4>
                    <p className="text-sm">Reglene til tidløse favoritter som "Beer Pong" og "Ring of Fire", lett tilgjengelig.</p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                    <Music className="mx-auto h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold text-foreground">Musikkeleker</h4>
                    <p className="text-sm">Enkle drikkeleker basert på kjente sanger, med direkte lenke til Spotify.</p>
                </div>
            </div>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-6 text-center">
          <Download className="mx-auto h-8 w-8 text-accent mb-2" />
          <h3 className="font-semibold text-foreground text-xl">Installer som App for Offline Bruk</h3>
          <p>
            GameNight er bygget som en Progressive Web App (PWA). Det betyr at du kan installere den på mobilen din og bruke den som en vanlig app – helt gratis. Da vil alle spillene fungere selv om du mister internettforbindelsen på hytta eller i parken!
          </p>
          <p className="text-xs text-muted-foreground/80 pt-2">
            Se etter en "Installer"-knapp på siden, eller bruk "Legg til på Hjem-skjerm"-funksjonen i nettleseren din.
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-6 text-center">
          <h3 className="font-semibold text-foreground text-xl">Hvordan holder vi det gratis?</h3>
          <p>
            Vårt håp er å kunne holde GameNight gratis så lenge som mulig. For å dekke kostnadene for servere og videreutvikling, viser vi annonser. Dette lar oss fortsette å lage nye spill og forbedre siden uten å måtte ta betalt fra deg.
          </p>
        </div>
        
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-6 text-center">
          <h3 className="font-semibold text-foreground text-xl">Et lidenskapsprosjekt</h3>
          <p>
            GameNight er et lidenskapsprosjekt som utvikles på fritiden. Det betyr at nye funksjoner og spill kommer når inspirasjonen (og tiden) strekker til. Vi setter utrolig stor pris på tålmodigheten og støtten fra dere!
          </p>
        </div>

        <div className="space-y-4 rounded-lg border-2 border-dashed border-primary/50 bg-card/50 p-6 text-center">
          <h3 className="font-bold text-primary text-2xl">Liker du det vi gjør? Støtt oss!</h3>
          <p>
            Hvis GameNight har gjort festen din bedre, blir vi utrolig takknemlige for et
            frivillig bidrag. Hver krone går direkte til å holde serverne i gang og utvikle nye,
            morsomme spill til deg og vennene dine.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Button size="lg" asChild className="transform transition-transform duration-200 hover:scale-105">
              <a href="https://www.buymeacoffee.com/gamenight" target="_blank" rel="noopener noreferrer">
                <CreditCard className="mr-2 h-5 w-5" />
                Doner med Kort
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild className="transform transition-transform duration-200 hover:scale-105">
              <a href="https://vipps.no/privat/" target="_blank" rel="noopener noreferrer">
                <span className="mr-2 text-lg">🇳🇴</span>
                Doner med Vipps
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/80 pt-2">
              Donasjon via kort (Stripe) støtter Apple Pay og Google Pay for enklest mulig betaling.
          </p>
        </div>
      </div>
    ),
  },
  'personvern': {
    title: 'Personvernerklæring for GameNight',
    content: (
      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          Din tillit er viktig for oss. Her forklarer vi hvilken informasjon vi samler inn, hvorfor
          vi gjør det, og hvordan vi bruker den for å gjøre GameNight bedre for alle.
        </p>

        <div>
          <h3 className="font-semibold text-foreground text-xl mb-2">Spilldata (Lagres kun hos deg)</h3>
          <p>
            For å gi deg en sømløs spillopplevelse, lagrer vi spillernavnene du legger inn lokalt i
            din egen nettleser ved hjelp av `localStorage`. Denne informasjonen forlater aldri din
            enhet, sendes ikke til våre servere, og er kun tilgjengelig for deg. Du kan når som
            helst slette denne dataen ved å tømme nettleserdataene dine.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-6 space-y-3">
            <h3 className="font-semibold text-foreground text-xl">Bruk av informasjonskapsler (Cookies)</h3>
            <p>
                GameNight bruker tredjeparts-tjenester som Google Analytics og Google AdSense. For å fungere, plasserer disse tjenestene små tekstfiler, kalt informasjonskapsler (cookies), på enheten din.
            </p>
            <p>
                Disse brukes til å samle inn anonyme data om hvordan du bruker siden (analyse) og til å vise deg relevante annonser. Dette hjelper oss å forstå bruksmønstre og å finansiere driften av siden.
            </p>
             <p>
                Du kan når som helst administrere eller slette informasjonskapsler via innstillingene i nettleseren din. Vær oppmerksom på at dette kan påvirke funksjonaliteten på enkelte nettsteder.
            </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground text-xl mb-2">Anonym Bruksanalyse (Google Analytics)</h3>
          <p>
            Vi bruker Google Analytics for å forstå hvordan GameNight blir brukt. Vi samler inn
            anonym og aggregert statistikk, for eksempel hvilke spill som er mest populære og
            hvilke typer enheter som brukes. Dette hjelper oss med å forbedre spillene og
            prioritere nye funksjoner. Ingen personlig identifiserbar informasjon blir lagret av oss
            i denne prosessen.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground text-xl mb-2">Annonsering (Google AdSense)</h3>
          <p>
            For å dekke driftskostnadene og holde tjenesten gratis, viser vi annonser levert av
            Google AdSense. Som nevnt over, bruker AdSense informasjonskapsler for å tilpasse
            annonser til deg, basert på dine tidligere besøk på denne eller andre
            nettsider.
          </p>
          <p className="mt-2">
            Du kan velge bort personlig tilpasset annonsering ved å besøke{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Googles Annonseinnstillinger
            </a>.
          </p>
        </div>
        
        <div>
            <h3 className="font-semibold text-foreground text-xl mb-2">Søkestatistikk (Google Search Console)</h3>
            <p>
                Vi bruker Google Search Console for å se hvordan brukere finner GameNight via Google-søk. Dette hjelper oss å forstå hvilke søkeord som fører til siden vår, slik at vi kan gjøre den mer synlig for andre som leter etter partyspill. Denne dataen er anonym og brukes kun for å forbedre vår synlighet i søkemotorer.
            </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground text-xl mb-2">Endringer i erklæringen</h3>
          <p>
            Denne personvernerklæringen kan bli oppdatert. Vi anbefaler at du ser gjennom den
            jevnlig for å holde deg informert.
          </p>
        </div>
      </div>
    ),
  },
  'kontakt-oss': {
    title: 'Kontakt Oss',
    content: (
      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          Vi elsker å høre fra dere! Enten du har ris, ros, en idé til et nytt spill, eller bare vil si hei, er du velkommen til å ta kontakt.
        </p>

        <div className="rounded-lg border border-border bg-card/50 p-6 space-y-3">
            <h3 className="font-semibold text-foreground text-xl">E-post</h3>
            <p>
                Den enkleste måten å nå oss på er via e-post. Vi leser alt og prøver å svare så fort vi kan.
            </p>
            <Button asChild>
                <a href="mailto:hei@gamenight.no">
                    <Mail className="mr-2 h-4 w-4" />
                    Send oss en e-post
                </a>
            </Button>
             <p className="text-sm pt-2">
                Siden GameNight er et lidenskapsprosjekt som drives på fritiden, kan det ta litt tid før du får svar. Vi setter stor pris på din tålmodighet!
            </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-xl">Rapportere en feil?</h3>
          <p>
            Opplever du en teknisk feil eller en skrivefeil i spillet? Send oss gjerne en e-post med en kort beskrivelse av problemet og hvilken enhet/nettleser du bruker, så skal vi se på det!
          </p>
        </div>
      </div>
    ),
  },
};

export default function InfoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const page = pages[slug];

  if (!page) {
    notFound();
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 md:py-16 max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>
        </Button>
      </div>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{page.title}</CardTitle>
        </CardHeader>
        <CardContent>{page.content}</CardContent>
      </Card>
      <motion.div
        className="mt-12 w-full flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AdBanner />
      </motion.div>
    </motion.div>
  );
}
