import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Vilkår | GameNight',
  description:
    'Enkle bruksvilkår for GameNight, inkludert ansvar, aldersgrenser, innhold og kontaktinformasjon.',
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
          Sist oppdatert: 2026-03-09
        </p>
      </header>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            1. Om tjenesten
          </h2>
          <p>
            GameNight er en gratis nettbasert tjeneste for selskapsleker og
            festspill. Innholdet leveres som underholdning og generell veiledning
            til spillkvelder.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            2. Brukeransvar og aldersgrenser
          </h2>
          <p>
            Du er selv ansvarlig for trygg og lovlig bruk. Enkelte spill er merket
            18+ og er kun ment for voksne. Respekter alltid grenser, samtykke og
            lokale lover.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            3. Tilgjengelighet og endringer
          </h2>
          <p>
            Vi forsøker å holde tjenesten stabil, men kan ikke garantere kontinuerlig
            tilgjengelighet. Spill, tekster og funksjoner kan endres eller fjernes
            uten forhåndsvarsel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            4. Donasjoner og annonser
          </h2>
          <p>
            Eventuelle donasjoner er frivillige og refunderes normalt ikke. For å
            finansiere drift kan tjenesten vise annonser i tråd med gjeldende regler.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            5. Personvern
          </h2>
          <p>
            Les vår{' '}
            <Link href="/info/personvern" className="text-primary hover:underline">
              personvernerklæring
            </Link>{' '}
            for informasjon om cookies, lokal lagring og tredjepartstjenester.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Kontakt</h2>
          <p>
            Spørsmål om vilkårene kan sendes til{' '}
            <a href="mailto:hei@gamenight.no" className="text-primary hover:underline">
              hei@gamenight.no
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
