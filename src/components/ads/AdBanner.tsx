'use client';

import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

export function AdBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full max-w-lg select-none items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 text-center text-muted-foreground',
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Megaphone className="h-6 w-6" />
        <p className="text-sm font-semibold uppercase tracking-wider">
          Annonse
        </p>
      </div>
    </div>
  );
}
