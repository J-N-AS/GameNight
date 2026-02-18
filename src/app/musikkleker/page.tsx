import type { Metadata } from 'next';
import { MusikklekerClient } from '@/components/musikkleker/MusikklekerClient';
import musikkleker from '@/data/musikkleker.json';
import type { MusicGame } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Musikkeleker for Vorspiel | GameNight',
  description: 'Finn de beste drikkelekene basert på kjente sanger. Perfekt for å få i gang festen!',
};

export default function MusikklekerPage() {
  const games: MusicGame[] = musikkleker;
  return <MusikklekerClient games={games} />;
}
