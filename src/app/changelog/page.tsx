import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { CHANGELOG_ENTRIES } from '@/lib/changelog';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Oppdateringer | GameNight',
  description:
    'Se hva som har blitt lansert i GameNight, fra nye forbedringer i flyt og mobilbruk til mer personlige infosider og annen småkaotisk framgang.',
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
    <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
      <JsonLd id="changelog-breadcrumb-jsonld" data={breadcrumbJsonLd} />

      <header className="mb-12 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
          Oppdateringer
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tighter md:text-5xl font-headline">
          Siste nytt fra labben
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Små og store ting vi faktisk har sendt ut i GameNight. Mer dev-logg,
          mindre presentasjon med pekestokk.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Datoene er omtrentlige, men resten er ekte nok.
        </p>
      </header>

      <div className="relative space-y-12 before:absolute before:bottom-3 before:left-5 before:top-3 before:w-px before:bg-border/60">
        {CHANGELOG_ENTRIES.map((entry) => (
          <article
            key={`${entry.date}-${entry.title}`}
            className="relative pl-16"
          >
            <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-background text-xl shadow-sm">
              <span aria-hidden="true">{entry.emoji}</span>
            </div>

            <div className="space-y-3">
              <time
                dateTime={entry.date}
                className="block text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground"
              >
                {entry.dateLabel ?? formatDate(entry.date)}
              </time>

              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {entry.title}
              </h2>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                {entry.summary}
              </p>

              <ul className="list-disc space-y-2 pl-5 text-foreground/85 marker:text-primary">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Har du sett noe rart, savner en endring eller vil dytte oss i riktig
        retning? Send en melding via{' '}
        <Link href="/info/kontakt-oss" className="text-primary hover:underline">
          kontakt
        </Link>
        . Vi fyller på her når noe faktisk er ute i verden.
      </p>
    </div>
  );
}
