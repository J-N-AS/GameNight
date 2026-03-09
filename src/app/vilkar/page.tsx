import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Vilkår | GameNight',
  description:
    'Bruksvilkår for GameNight: gratis bruk, 18+, ansvarlig spill, samtykke, donasjoner og kontaktinformasjon.',
  path: '/vilkar',
});

export default function VilkarPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Vilkår', path: '/vilkar' },
  ]);

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
      <JsonLd id="vilkar-breadcrumb-jsonld" data={breadcrumbJsonLd} />

      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Vilkår for bruk
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Sist oppdatert: 9. mars 2026
        </p>
      </header>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            1. Om tjenesten
          </h2>
          <p>
            GameNight er en gratis norsk tjeneste for drikkespill, festspill,
            isbrytere, vorspiel-spill og andre sosiale leker for voksne.
            Tjenesten brukes direkte i nettleseren, og én mobil eller skjerm
            styrer normalt spilløkten.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            2. Gratis bruk
          </h2>
          <p>
            GameNight er gratis å bruke. Du trenger ikke login, abonnement eller
            kjøp av ekstra spillpakker for å bruke tjenesten. Vi kan finansiere
            driften med annonser og frivillige donasjoner.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            3. Aldersgrense og ansvarlig bruk
          </h2>
          <p>
            GameNight er laget for voksne 18+. Du er selv ansvarlig for trygg og
            lovlig bruk, og for å følge lokale regler. GameNight skal ikke brukes
            som oppfordring til overdreven drikking.
          </p>
          <p className="mt-2">
            Du trenger ikke å drikke alkohol for å bruke spillene. Dere kan alltid
            bruke alkoholfritt, poeng eller egne husregler i stedet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            4. Samtykke og grenser
          </h2>
          <p>
            Respekter alltid andres grenser. Oppgaver som oppleves ubehagelige,
            for personlige eller for fysiske skal kunne hoppes over uten press.
            Dette gjelder særlig spill med flørtete eller voksenrettet innhold.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            5. Tilgjengelighet og endringer
          </h2>
          <p>
            Vi forsøker å holde GameNight stabil og tilgjengelig, men kan ikke
            garantere feilfri drift til enhver tid. Spill, tekster, kategorier og
            funksjoner kan endres, fjernes eller oppdateres uten forhåndsvarsel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            6. Donasjoner og annonser
          </h2>
          <p>
            Eventuelle donasjoner er frivillige og refunderes normalt ikke når en
            betalingsflyt er gjennomført. GameNight kan vise annonser for å støtte
            drift og videreutvikling.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            7. Personvern
          </h2>
          <p>
            Les vår{' '}
            <Link href="/info/personvern" className="text-primary hover:underline">
              personvernerklæring
            </Link>{' '}
            for informasjon om lokal lagring, samtykke og donasjon.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            8. Kontakt og utgiver
          </h2>
          <p>
            Spørsmål om vilkårene kan sendes til{' '}
            <a href="mailto:hei@gamenight.no" className="text-primary hover:underline">
              hei@gamenight.no
            </a>
            . GameNight publiseres foreløpig under merkenavnet GameNight, og full
            selskapsinformasjon publiseres her når den formelle strukturen er på
            plass.
          </p>
        </section>
      </div>
    </div>
  );
}
