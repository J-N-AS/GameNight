'use client';

import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const pages: { [key: string]: { title: string; content: React.ReactNode } } = {
  'om-oss': {
    title: 'Vårt Løfte: Gratis Fest, For Alltid',
    content: (
      <div className="space-y-8 text-muted-foreground">
        <div className="space-y-2 text-lg">
          <p>
            GameNight ble startet som en reaksjon på en frustrerende trend: At de beste
            partyspillene låses bak dyre abonnementer.
          </p>
          <p className="font-semibold text-foreground">
            Vi mener at det å ha det gøy med venner ikke skal koste skjorta.
          </p>
          <p>
            Vårt mål er enkelt: Å tilby de beste drikke- og partyspillene helt gratis, rett i
            nettleseren din. Ingen app-nedlastninger, ingen "premium"-funksjoner, bare ren og
            uforfalsket moro.
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-6 text-center">
          <h3 className="font-semibold text-foreground text-xl">Hvorfor viser vi reklame?</h3>
          <p>
            Å holde GameNight gratis for alle betyr at vi har driftskostnader for servere og
            videreutvikling. Annonsene hjelper oss med å dekke disse kostnadene, slik at vi kan
            fortsette å tilby og forbedre spillene uten å måtte ta betalt fra deg.
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
              <a href="#" target="_blank" rel="noopener noreferrer">
                <CreditCard className="mr-2 h-5 w-5" />
                Doner med Kort
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild className="transform transition-transform duration-200 hover:scale-105">
              <a href="#" target="_blank" rel="noopener noreferrer">
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
    </motion.div>
  );
}
