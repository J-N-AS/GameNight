import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { CHANGELOG_ENTRIES } from '@/lib/changelog';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Oppdateringer | GameNight',
  description:
    'Siste oppdateringer i GameNight med nye hjelpesider, bedre mobilopplevelse og andre forbedringer som brukere faktisk merker.',
  path: '/changelog',
});

function formatDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);

  return new Intl.DateTimeFormat('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export default function ChangelogPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Oppdateringer', path: '/changelog' },
  ]);

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
      <JsonLd id="changelog-breadcrumb-jsonld" data={breadcrumbJsonLd} />

      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Oppdateringer
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Her legger vi inn større endringer som påvirker opplevelsen i
          GameNight. Små interne justeringer havner ikke alltid her.
        </p>
      </header>

      <div className="space-y-5">
        {CHANGELOG_ENTRIES.map((entry) => (
          <article
            key={`${entry.date}-${entry.title}`}
            className="rounded-lg border border-border/70 bg-card/50 p-5"
          >
            <div className="text-sm text-muted-foreground">
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            </div>
            <h2 className="text-2xl font-semibold mt-1">{entry.title}</h2>
            <p className="text-muted-foreground mt-2">{entry.summary}</p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-muted-foreground">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Har du innspill eller ser en feil? Send gjerne en melding via{' '}
        <Link href="/info/kontakt-oss" className="text-primary hover:underline">
          kontakt
        </Link>
        . Vi oppdaterer siden når større forbedringer er ute.
      </p>
    </div>
  );
}
