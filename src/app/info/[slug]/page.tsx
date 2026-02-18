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
    title: 'Personvernerklæring',
    content: (
      <div className="space-y-4 text-muted-foreground">
        <h3 className="font-semibold text-foreground">Datainnsamling og Bruk</h3>
        <p>
          GameNight er designet med personvern i tankene. Vi samler ikke inn
          personlig identifiserbar informasjon.
        </p>
        <p>
          For å forbedre spillopplevelsen, lagrer vi spillernavnene du legger inn lokalt i din
          nettleser ved hjelp av `localStorage`. Denne informasjonen forlater aldri din enhet og
          sendes ikke til våre servere. Du kan når som helst slette denne informasjonen ved å fjerne
          spillerne i spillet.
        </p>
        <h3 className="font-semibold text-foreground">Annonsering</h3>
        <p>
          For å dekke driftskostnadene og holde tjenesten gratis, kan denne applikasjonen vise
          annonser fra tredjepartsnettverk som Google AdSense. Disse nettverkene kan bruke cookies for
          å vise relevante annonser basert på tidligere besøk.
        </p>
        <h3 className="font-semibold text-foreground">Endringer</h3>
        <p>
          Denne personvernerklæringen kan bli oppdatert. Vi anbefaler at du ser gjennom den jevnlig.
        </p>
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
