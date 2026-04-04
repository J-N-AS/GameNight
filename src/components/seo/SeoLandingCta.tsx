import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SeoLandingCtaProps = {
  title: string;
  description?: string;
  headingId: string;
  className?: string;
  buttonLabel?: string;
};

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
        'mx-auto max-w-2xl border-y border-border/70 bg-white/5 py-8 md:py-10',
        className
      )}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="max-w-xl">
          <h2
            id={headingId}
            className="text-2xl font-bold font-headline tracking-tight text-foreground md:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-base leading-7 text-muted-foreground md:text-[1.0625rem]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex md:justify-end">
          <Button asChild size="lg" className="px-6 text-base">
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
