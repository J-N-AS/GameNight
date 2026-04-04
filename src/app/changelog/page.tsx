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
  const heroStats = [
    { value: `${CHANGELOG_ENTRIES.length}+`, label: 'milepæler logget' },
    { value: 'ca.', label: 'datoer med godvilje' },
    { value: 'mer flyt', label: 'mindre knot' },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
      <JsonLd id="changelog-breadcrumb-jsonld" data={breadcrumbJsonLd} />

      <header className="mb-8">
        <div className="rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-card via-card to-primary/10 p-6 text-center shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary">
              Oppdateringer med litt ekstra saus ✨
            </span>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-muted-foreground">
              Shipper fort. Logger nesten like fort.
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl font-headline">
            Historien så langt
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
            Her samler vi større endringer, små glow-ups og ting som faktisk
            merkes når folk bruker GameNight. Ikke alt er skrevet i stein, men
            det gir et ganske fint bilde av retningen.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/70 bg-background/70 px-4 py-4"
              >
                <div className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="mb-8 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm">
        <p className="font-medium text-foreground">
          Liten disclaimer fra bakrommet 😅
        </p>
        <p className="mt-1 text-muted-foreground">
          Datoene under er omtrentlige. Vi har ikke en perfekt historisk logg på
          alt, så denne siden er ment som en levende, litt uformell tidslinje
          over hva som har skjedd.
        </p>
      </section>

      <div className="relative space-y-6 before:absolute before:bottom-2 before:left-4 before:top-4 before:w-px before:bg-border/70">
        {CHANGELOG_ENTRIES.map((entry) => (
          <article
            key={`${entry.date}-${entry.title}`}
            className="relative pl-12"
          >
            <div className="absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-background text-lg shadow-sm">
              <span aria-hidden="true">{entry.emoji}</span>
            </div>

            <div className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium uppercase tracking-wide text-primary">
                  {entry.tag}
                </span>
                <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-muted-foreground">
                  <time dateTime={entry.date}>
                    {entry.dateLabel ?? formatDate(entry.date)}
                  </time>
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                {entry.title}
              </h2>
              <p className="mt-3 rounded-2xl bg-background/60 p-4 text-foreground/90">
                {entry.summary}
              </p>

              <ul className="mt-4 space-y-2 text-muted-foreground">
                {entry.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 text-primary">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Har du innspill, savner en oppdatering eller vil tipse om noe vi burde
        fikse? Send gjerne en melding via{' '}
        <Link href="/info/kontakt-oss" className="text-primary hover:underline">
          kontakt
        </Link>
        . Vi oppdaterer siden når det faktisk har skjedd noe verdt å skryte av.
      </p>
    </div>
  );
}
