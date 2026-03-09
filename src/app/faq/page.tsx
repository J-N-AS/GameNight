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
      'GameNight er en norsk, nettleserbasert samling av selskapsleker, partyspill og drikkelek-guider. Dere spiller på én enhet og følger samme flyt i rommet.',
  },
  {
    question: 'Må jeg installere appen?',
    answer:
      'Nei. GameNight fungerer direkte i nettleseren. Du kan i tillegg legge siden til på hjemskjermen som en PWA for raskere tilgang.',
  },
  {
    question: 'Hvordan spiller vi på én mobil?',
    answer:
      'Én person styrer kortene og knappene på mobilen, mens resten spiller sammen rundt samme skjerm. Dere kan også bruke skjermdeling eller casting til TV.',
  },
  {
    question: 'Kan vi caste til TV?',
    answer:
      'Ja. Dere kan bruke AirPlay, Chromecast eller annen skjermdeling fra mobilen. Da ser hele gruppen samme spillvisning samtidig.',
  },
  {
    question: 'Fungerer GameNight offline?',
    answer:
      'Delvis. Etter at appen er besøkt med nett, caches mye lokalt via PWA. Enkelte deler kan fortsatt kreve nett, så vi anbefaler å åpne appen før dere mister dekning.',
  },
  {
    question: 'Koster det noe?',
    answer:
      'Nei, tjenesten er gratis å bruke. Frivillige donasjoner brukes til å holde drift og videreutvikling i gang.',
  },
  {
    question: 'Er alt innhold for 18+?',
    answer:
      'Nei. GameNight har både allment innhold og egne 18+-spill. Innhold med voksen-tema merkes tydelig med advarsel og aldersmarkering.',
  },
  {
    question: 'Hvordan fungerer donasjoner?',
    answer:
      'Donasjon er helt frivillig. Hvis donasjon er aktivert, sendes du til en trygg ekstern betalingsflyt. Uten aktivert oppsett vises en tydelig melding i appen.',
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: 'FAQ | GameNight',
  description:
    'Ofte stilte spørsmål om hvordan GameNight fungerer på mobil/TV, offline-støtte, kostnad, 18+-innhold og donasjoner.',
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
          FAQ
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Svar på de vanligste spørsmålene om bruk, innhold, personvern og
          donasjon.
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
          Fant du ikke svaret du trengte? Ta kontakt via{' '}
          <Link href="/info/kontakt-oss" className="text-primary hover:underline">
            kontaktsiden
          </Link>{' '}
          eller les mer på{' '}
          <Link href="/info/personvern" className="text-primary hover:underline">
            personvern
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
