import type { Metadata } from 'next';
import { MusikklekerClient } from '@/components/musikkleker/MusikklekerClient';
import musikklekerData from '@/data/musikkleker.json';
import type { MusicGameCategory } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Musikkeleker for Vorspiel | GameNight',
  description: 'En samling musikkleker og partyspill basert på klassiske sanger. Koble til anlegget, trykk play, og la reglene styre kvelden.',
};

export default function MusikklekerPage() {
  const categories: MusicGameCategory[] = musikklekerData.categories;
  return <MusikklekerClient categories={categories} />;
}
