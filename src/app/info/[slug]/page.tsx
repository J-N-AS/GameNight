'use client';

import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const pages: { [key: string]: { title: string; content: React.ReactNode } } = {
  'om-oss': {
    title: 'Om GameNight',
    content: (
      <div className="space-y-4 text-muted-foreground">
        <p>
          GameNight er en gratis, nettleserbasert partyspill-plattform designet for å gjøre enhver
          sosial sammenkomst litt morsommere. Vårt mål er å tilby enkle, engasjerende og umiddelbart
          spillbare spill som ikke krever nedlastning eller komplisert oppsett.
        </p>
        <p>
          Enten det er vorspiel, en rolig kveld med venner eller en stor fest, har GameNight et
          spill som passer anledningen.
        </p>
        <p>Takk for at du spiller!</p>
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
