'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Gamepad2,
  Library,
  Music,
  Download,
  Trophy,
  Loader2,
  Lightbulb,
  Smartphone,
  Cast,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdBanner } from '@/components/ads/AdBanner';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { requestDonation } from '@/lib/donations';
import type { InfoPageSlug } from '@/lib/info-pages';
import { withBasePath } from '@/lib/base-path';

function OmOssContent() {
  const [donationAmount, setDonationAmount] = useState(50);
  const [isDonating, setIsDonating] = useState(false);
  const { toast } = useToast();

  const handleDonate = async () => {
    setIsDonating(true);
    try {
      const data = await requestDonation(donationAmount);

      if (data.status === 'not_configured') {
        toast({
          title: 'Tusen takk for tanken! ❤️',
          description:
            'Donasjoner er ikke aktivert helt enda, men vi setter utrolig stor pris på at du ville støtte oss!',
        });
      } else if (data.status === 'success' && data.checkoutFrontendUrl) {
        window.location.href = data.checkoutFrontendUrl;
      } else {
        throw new Error(data.message || 'En ukjent feil oppstod');
      }
    } catch (error) {
      console.error('Donation failed:', error);
      toast({
        title: 'Noe gikk galt',
        description: 'Kunne ikke starte donasjonen. Vennligst prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <div className="space-y-8 text-muted-foreground">
      <div className="space-y-4 text-lg">
        <p>
          GameNight er en norsk nettside for drikkespill, festspill,
          vorspiel-spill, isbrytere og sosiale spill for voksne 18+. Målet er å
          gjøre det lett å få i gang stemningen på vors, studentfest, hyttetur,
          julebord eller en helt vanlig kveld med venner.
        </p>
        <p className="font-semibold text-foreground">
          Åpne siden, velg et spill og sett i gang. Ingen login. Ingen
          abonnement. Ingen betalte spillpakker. Én mobil eller nettleser styrer
          hele spilløkten.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card/50 p-5 text-center">
          <Gamepad2 className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">Gratis å bruke</h3>
          <p className="mt-2 text-sm">
            GameNight skal være gratis. Dere trenger ikke konto, abonnement
            eller ekstra kjøp for å komme i gang.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card/50 p-5 text-center">
          <Smartphone className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">Én mobil styrer</h3>
          <p className="mt-2 text-sm">
            Én person åpner GameNight og styrer kortene. Resten spiller sammen
            rundt samme skjerm.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card/50 p-5 text-center">
          <Cast className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">Fungerer også på TV</h3>
          <p className="mt-2 text-sm">
            Når dere vil at hele rommet skal se, kan mobilen deles til TV med
            AirPlay, Cast eller vanlig skjermdeling.
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-card/50 p-6">
        <Lightbulb className="mb-2 h-8 w-8 text-accent" />
        <h3 className="text-xl font-semibold text-foreground">
          Hvorfor GameNight finnes
        </h3>
        <p>
          GameNight ble laget som et enklere alternativ til drikkespill-apper
          som låser de morsomste spillene bak abonnement, betalte spillpakker
          eller konto.
          Her skal det være lett å starte, lett å forstå og lett å dele med
          vennene dine.
        </p>
        <p>
          Ambisjonen er å bygge et varig norsk underholdningsprodukt for voksne
          som vil ha drikkeleker, festspill, flørtete spill og sosiale
          isbrytere samlet på ett sted.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="font-semibold text-foreground text-2xl text-center">
          Hva finner du på GameNight?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <Gamepad2 className="mx-auto h-8 w-8 text-primary mb-2" />
            <h4 className="font-semibold text-foreground">Spill dere starter med én gang</h4>
            <p className="text-sm">
              Raske partyspill som Pekefest, Spinn flasken og andre kortbaserte
              favoritter som fungerer rett i nettleseren.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <Library className="mx-auto h-8 w-8 text-primary mb-2" />
            <h4 className="font-semibold text-foreground">Klassiske drikkeleker</h4>
            <p className="text-sm">
              Regler og forklaringer til kjente drikkeleker og vorspiel-spill
              som Beer Pong, Ring of Fire og andre klassikere.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <Music className="mx-auto h-8 w-8 text-primary mb-2" />
            <h4 className="font-semibold text-foreground">Musikk, skjerm og sosiale leker</h4>
            <p className="text-sm">
              Musikkeleker, skjermleker, isbrytere og flørtete spill for kvelder
              som trenger litt ekstra energi.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-card/50 p-6 text-center">
        <Trophy className="mx-auto h-8 w-8 text-accent mb-2" />
        <h3 className="font-semibold text-foreground text-xl">
          Oppsummering som avslutter kvelden med stil
        </h3>
        <p>
          Etter en spilløkt kan dere få en morsom oppsummering med kåringer som
          kveldens MVP og kveldens skyteskive. Perfekt når noen vil dele kveldens
          høydepunkter videre.
        </p>
      </div>

      <div
        id="mobil-tv-guide"
        className="space-y-4 rounded-lg border border-border bg-card/50 p-6"
      >
        <div className="text-center">
          <Smartphone className="mx-auto h-8 w-8 text-accent mb-2" />
          <h3 className="font-semibold text-foreground text-xl">
            Bruk GameNight på én mobil eller på TV
          </h3>
          <p>
            GameNight er laget for én felles skjerm. Én person styrer kortene på
            mobil eller i nettleseren, og resten spiller sammen rundt bordet
            eller via delt skjerm på TV.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/40 p-4 space-y-2">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Download className="h-4 w-4" />
            Installasjon er valgfritt
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              Du trenger ikke installere noe for å spille. GameNight fungerer
              direkte i nettleseren.
            </li>
            <li>
              <strong>iPhone:</strong> Åpne i Safari, trykk Del og velg{' '}
              <em>Legg til på Hjem-skjerm</em> hvis du vil ha raskere tilgang.
            </li>
            <li>
              <strong>Android:</strong> Åpne i Chrome og velg{' '}
              <em>Installer app</em> eller <em>Legg til på startskjerm</em> om
              du vil ha den lett tilgjengelig.
            </li>
          </ul>
          <p className="text-xs text-muted-foreground/80">
            Installasjon er mest en snarvei. Selve spillingen fungerer fint uten.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/40 p-4 space-y-2">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Cast className="h-4 w-4" />
            Cast / skjermdeling til TV
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              <strong>iPhone:</strong> Åpne Kontrollsenter og bruk{' '}
              <em>Skjermspeiling</em> via AirPlay til Apple TV eller kompatibel
              TV.
            </li>
            <li>
              <strong>Android:</strong> Bruk <em>Cast</em> /{' '}
              <em>Skjermdeling</em> fra hurtiginnstillinger.
            </li>
            <li>
              Når skjermen er delt, lar dere én person trykke “Neste kort”, så
              følger hele gruppa samme flyt.
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card/50 p-6">
        <Library className="h-8 w-8 text-accent" />
        <h3 className="font-semibold text-foreground text-xl">
          Trygg og sosial bruk først
        </h3>
        <p>
          Noen spill hos GameNight er drikkespill. Andre fungerer like godt som
          festspill eller isbrytere uten alkohol. Dere bestemmer selv nivået.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Du må ikke drikke alkohol for å bruke GameNight.</li>
          <li>Bytt gjerne ut alkohol med vann, brus, poeng eller andre regler som passer gruppa.</li>
          <li>Hopp over oppgaver som ikke passer, og respekter alltid grenser og samtykke.</li>
          <li>GameNight er laget for voksne 18+ og skal brukes med sunn dømmekraft.</li>
        </ul>
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-card/50 p-6">
        <Lightbulb className="h-8 w-8 text-accent" />
        <h3 className="font-semibold text-foreground text-xl">
          Gratis nå, bærekraftig over tid
        </h3>
        <p>
          Målet er at GameNight skal fortsette å være gratis å bruke. Over tid
          skal driften bæres av annonser og frivillige donasjoner, ikke av
          abonnement eller låste spillpakker.
        </p>
        <p>
          Hvis du vil bidra, kan du støtte GameNight frivillig. Det hjelper oss
          å utvikle nye spill, holde siden ved like og gjøre produktet bedre for
          neste spillkveld.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border-2 border-dashed border-primary/50 bg-card/50 p-6 text-center">
        <h3 className="font-bold text-primary text-2xl">
          Vil du holde GameNight gratis? Støtt oss gjerne
        </h3>
        <p>
          Hvis GameNight har reddet vorspielet, hytteturen eller festen, setter
          vi stor pris på et frivillig bidrag. Donasjon er helt valgfritt.
        </p>
        <div className="flex justify-center gap-2 pt-2">
          {[25, 50, 100].map((amount) => (
            <Button
              key={amount}
              variant={donationAmount === amount ? 'default' : 'outline'}
              onClick={() => setDonationAmount(amount)}
              className="transform transition-transform duration-200 hover:scale-105"
            >
              {amount} kr
            </Button>
          ))}
        </div>
        <div className="mt-4 flex justify-center items-center min-h-[48px]">
          <div className="w-full max-w-[280px]">
            <Button
              onClick={handleDonate}
              disabled={isDonating}
              className="w-full h-auto p-0 bg-transparent hover:bg-transparent disabled:opacity-50"
              aria-label={`Doner ${donationAmount} kr med Vipps`}
            >
              {isDonating ? (
                <div className="flex items-center justify-center w-full h-[48px] bg-muted/50 rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Image
                  src={withBasePath('/vipps-button.svg')}
                  alt={`Doner ${donationAmount} kr med Vipps`}
                  width={280}
                  height={48}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/80 pt-2">
          Vipps brukes som en enkel betalingsflyt når donasjon er aktivert.
        </p>
      </div>
    </div>
  );
}

const pages: Record<InfoPageSlug, { title: string; content: ReactNode }> =
  {
    'om-oss': {
      title: 'Om GameNight',
      content: <OmOssContent />,
    },
    personvern: {
      title: 'Personvern i GameNight',
      content: (
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            GameNight er laget for å være enkelt å bruke uten konto eller login.
            Her forklarer vi hva som faktisk lagres, hva som ikke gjør det, og
            hva som skjer hvis du velger å støtte tjenesten med donasjon.
          </p>

          <div>
            <h3 className="font-semibold text-foreground text-xl mb-2">
              Ingen konto, ingen profil
            </h3>
            <p>
              Du kan bruke GameNight uten å registrere deg, lage passord eller
              opprette profil. Vi ber heller ikke om fødselsdato eller andre
              personopplysninger for å starte en vanlig spilløkt.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-xl">
              Hva som lagres lokalt hos deg
            </h3>
            <p>
              Spillernavn, enkel oppsummeringsdata og samtykkevalg lagres lokalt
              i nettleseren på enheten du bruker. Det gjør at dere kan fortsette
              kvelden uten å legge inn alt på nytt med én gang.
            </p>
            <p>
              Denne informasjonen blir liggende på enheten din til du sletter
              nettleserdataene. Den brukes for spillflyt på din side, ikke for å
              bygge en personlig profil hos oss.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-xl mb-2">
              Lokal lagring og raskere åpning
            </h3>
            <p>
              Nettleseren din kan også lagre deler av GameNight lokalt for å
              gjøre siden raskere å åpne igjen og mer stabil ved svak dekning.
              Dette er tekniske filer som hjelper opplevelsen på enheten din.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-6 space-y-3">
            <h3 className="font-semibold text-foreground text-xl mb-2">
              Samtykke, cookies og fremtidige endringer
            </h3>
            <p>
              GameNight bruker lokal lagring for å huske samtykke og enkle
              innstillinger i nettleseren. Per i dag kjører vi ikke aktive
              annonse- eller analyseverktøy i selve appen som bygger egne
              brukerprofiler.
            </p>
            <p>
              Hvis vi aktiverer annonser, analyse eller andre tredjepartstjenester
              senere, oppdaterer vi denne siden før de tas i bruk.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-xl mb-2">
              Donasjoner
            </h3>
            <p>
              Hvis du velger å støtte GameNight, sendes du videre til en ekstern
              betalingsflyt. For å starte denne kan valgt beløp deles med
              donasjonstjenesten. Selve betalingen behandles utenfor GameNight.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-xl mb-2">
              Kontakt
            </h3>
            <p>
              Spørsmål om personvern kan sendes til{' '}
              <a href="mailto:hei@gamenight.no" className="text-primary hover:underline">
                hei@gamenight.no
              </a>
              .
            </p>
          </div>
        </div>
      ),
    },
    'kontakt-oss': {
      title: 'Kontakt GameNight',
      content: (
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            Kontakt oss hvis du har spørsmål om spill, forslag til nye
            drikkeleker eller festspill, oppdager en feil, eller trenger
            informasjon om GameNight som produkt og utgiver.
          </p>

          <div className="rounded-lg border border-border bg-card/50 p-6 space-y-3">
            <h3 className="font-semibold text-foreground text-xl">E-post</h3>
            <p>
              Den enkleste måten å nå GameNight på er via e-post. Vi leser alt
              og svarer så raskt vi kan.
            </p>
            <Button asChild>
              <a href="mailto:hei@gamenight.no">
                <Mail className="mr-2 h-4 w-4" />
                Send oss en e-post
              </a>
            </Button>
            <p className="text-sm pt-2">
              I travle perioder kan svartiden være litt lengre, men alle
              henvendelser blir lest.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-xl">
              Typiske henvendelser
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>forslag til nye spill, temaer eller forbedringer</li>
              <li>feil, skrivefeil eller innhold som bør justeres</li>
              <li>spørsmål om donasjoner, personvern eller vilkår</li>
              <li>henvendelser om samarbeid eller publisherinformasjon</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-xl">
              Utgiver og publisherinformasjon
            </h3>
            <p>
              GameNight publiseres i dag under merkenavnet GameNight. Når den
              formelle virksomhetsstrukturen er på plass, oppdaterer vi denne
              siden med full selskapsinformasjon.
            </p>
            <p>
              Frem til da er{' '}
              <a href="mailto:hei@gamenight.no" className="text-primary hover:underline">
                hei@gamenight.no
              </a>{' '}
              hovedkontakt for alle bruker- og publisherhenvendelser.
            </p>
          </div>
        </div>
      ),
    },
  };

export function InfoPageClient({ slug }: { slug: InfoPageSlug }) {
  const page = pages[slug];

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
          <h1 className="text-3xl font-bold leading-tight">{page.title}</h1>
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
