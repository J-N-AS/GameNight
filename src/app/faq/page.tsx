import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  getCanonicalUrl,
} from '@/lib/seo';

const FAQ_ITEMS = [
  {
    question: 'Hva er GameNight?',
    answer:
      'GameNight er en norsk nettside for gratis drikkespill, festspill, vorspiel-spill og isbrytere for voksne 18+. Dere spiller direkte i nettleseren på én mobil eller deler skjermen til TV.',
  },
  {
    question: 'Må alle laste ned appen?',
    answer:
      'Nei. Ingen trenger å laste ned noe for å spille. Én mobil eller nettleser styrer spillet, og det er valgfritt å legge GameNight til på hjemskjermen for raskere åpning.',
  },
  {
    question: 'Hvordan spiller man på én mobil?',
    answer:
      'Én person åpner GameNight og styrer kortene, mens resten spiller sammen rundt samme skjerm. Det gjør GameNight enkelt å bruke på vors, studentfest, hyttetur og andre sosiale kvelder.',
  },
  {
    question: 'Kan man caste eller skjermdele til TV?',
    answer:
      'Ja. På iPhone kan dere bruke AirPlay eller skjermspeiling. På Android kan dere bruke Cast eller skjermdeling. Da ser hele gruppen samme spillvisning samtidig, mens én person trykker videre.',
  },
  {
    question: 'Fungerer GameNight på iPhone og Android?',
    answer:
      'Ja. GameNight er laget for mobil og fungerer i vanlige nettlesere på både iPhone og Android. Dere kan også bruke det på nettbrett eller laptop hvis det passer bedre for kvelden.',
  },
  {
    question: 'Må man drikke alkohol for å bruke GameNight?',
    answer:
      'Nei. Mange bruker GameNight som rene festspill eller isbrytere uten alkohol. Dere kan bruke vann, brus, poeng eller egne husregler i stedet for drikking.',
  },
  {
    question: 'Er GameNight gratis?',
    answer:
      'Ja. GameNight er gratis å bruke. Ingen login, ingen abonnement og ingen kjøp av game packs eller låste spillpakker.',
  },
  {
    question: 'Trenger man login eller konto?',
    answer:
      'Nei. Dere kan åpne GameNight og starte med én gang. Hvis dere vil, kan dere legge inn navn på spillerne, men dere trenger ikke brukerprofil eller innlogging.',
  },
  {
    question: 'Hvem passer GameNight for?',
    answer:
      'GameNight passer for voksne som vil ha drikkespill, festspill, vorspiel-spill, flørtete spill eller sosiale isbrytere. Det fungerer både for små vennegjenger og større grupper.',
  },
  {
    question: 'Er GameNight 18+?',
    answer:
      'Ja, GameNight er laget for voksne 18+. Flere spill er tydelig fest- og voksenrettede, og noen har advarsel når innholdet er mer direkte eller flørtete.',
  },
  {
    question: 'Kan man bruke GameNight på vors, studentfest, hyttetur eller julebord?',
    answer:
      'Ja. GameNight er laget nettopp for slike settinger. Mange bruker det på vors, fadderuke, studentfest, hyttetur, afterski, bursdag og julebord der én mobil kan styre hele kvelden.',
  },
  {
    question: 'Hvordan fungerer donasjoner?',
    answer:
      'Donasjon er helt frivillig. Hvis donasjon er aktivert, sendes du videre til en ekstern betalingsflyt. Bidrag brukes til å holde GameNight gratis og til å lage nytt innhold og forbedringer.',
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: 'FAQ | GameNight',
  description:
    'Ofte stilte spørsmål om GameNight: gratis drikkespill og festspill på én mobil, TV-casting, 18+, donasjoner og hvordan tjenesten brukes på vors og fest.',
  path: '/faq',
});

export default function FaqPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ]);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    mainEntityOfPage: getCanonicalUrl('/faq'),
    inLanguage: 'nb-NO',
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
      <JsonLd id="faq-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLd id="faq-page-jsonld" data={faqJsonLd} />

      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Ofte stilte spørsmål
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Her finner du korte svar om hvordan GameNight fungerer på mobil og TV,
          hvem det passer for, og hvorfor tjenesten er gratis uten login eller
          abonnement.
        </p>
      </header>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item) => (
          <section
            key={item.question}
            className="rounded-lg border border-border/70 bg-card/50 p-5"
          >
            <h2 className="text-xl font-semibold">{item.question}</h2>
            <p className="mt-2 text-muted-foreground">{item.answer}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        <p>
          Fant du ikke svaret du trengte? Les mer på{' '}
          <Link href="/info/om-oss" className="text-primary hover:underline">
            Om GameNight
          </Link>{' '}
          eller ta kontakt via{' '}
          <Link href="/info/kontakt-oss" className="text-primary hover:underline">
            kontaktsiden
          </Link>{' '}
          og les mer om personvern på{' '}
          <Link href="/info/personvern" className="text-primary hover:underline">
            personvern
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
