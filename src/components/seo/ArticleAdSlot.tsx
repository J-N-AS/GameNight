'use client';

type ArticleAdSlotProps = {
  slotId: string;
  className?: string;
};

export function ArticleAdSlot({ slotId, className }: ArticleAdSlotProps) {
  return (
    <aside
      aria-label="Annonseplassering"
      className={className ?? 'my-10 md:my-12'}
    >
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Annonse
      </p>
      {/* AdSense inline slot placeholder */}
      <div
        data-ad-slot-placeholder={slotId}
        style={{ minHeight: '100px' }}
        className="rounded-[1.75rem] border border-dashed border-border/70 bg-card/30"
      />
    </aside>
  );
}
