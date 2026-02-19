'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface VippsDonateButtonProps {
  amount: number;
  onClick: () => void;
  loading: boolean;
}

export function VippsDonateButton({
  amount,
  onClick,
  loading,
}: VippsDonateButtonProps) {
  
  return (
    <div className="flex justify-center items-center min-h-[48px]">
        <div className="w-full max-w-[280px]">
            <Button
                onClick={onClick}
                disabled={loading}
                className="w-full h-auto p-0 bg-transparent hover:bg-transparent disabled:opacity-50"
                aria-label={`Doner ${amount} kr med Vipps`}
            >
                {loading ? (
                    <div className="flex items-center justify-center w-full h-[48px] bg-muted/50 rounded-lg">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <Image
                        src="/vipps-button.svg"
                        alt={`Doner ${amount} kr med Vipps`}
                        width={280}
                        height={48}
                        className="w-full h-auto rounded-lg"
                        priority
                    />
                )}
            </Button>
        </div>
    </div>
  );
}
