import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SeoLandingCtaProps = {
  title: string;
  description: string;
  headingId: string;
  className?: string;
  buttonLabel?: string;
};

const defaultBenefits = [
  'Spill rett i nettleseren',
  'Ferdige runder på sekunder',
  'Perfekt for vorspiel og fest',
];

export function SeoLandingCta({
  title,
  description,
  headingId,
  className,
  buttonLabel = 'Start GameNight gratis her',
}: SeoLandingCtaProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-6 shadow-2xl shadow-primary/10 md:p-8',
        className
      )}
    >
      <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative grid gap-6 md:grid-cols-[1.4fr_auto] md:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">
            <Smartphone className="h-3.5 w-3.5" />
            Klar for appmodus?
          </p>
          <h2
            id={headingId}
            className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/80 md:text-base">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {defaultBenefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full border border-primary/20 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/75"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="flex md:justify-end">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full px-6 text-base shadow-lg shadow-primary/30"
          >
            <Link href="/">
              {buttonLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
