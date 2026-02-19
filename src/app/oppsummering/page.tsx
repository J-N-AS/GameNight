import { OppsummeringClient } from '@/components/session/OppsummeringClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kveldens Oppsummering | GameNight',
    description: 'Se kveldens kåringer, del med venner og gjør dere klare for neste runde.',
};


export default function OppsummeringPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
            <div className="w-full max-w-md">
                <Button variant="ghost" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Tilbake til forsiden
                    </Link>
                </Button>
            </div>
            <OppsummeringClient />
        </div>
    );
}
