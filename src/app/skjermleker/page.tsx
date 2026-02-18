import type { Metadata } from 'next';
import { SkjermlekerClient } from '@/components/skjermleker/SkjermlekerClient';
import type { ScreenGameCategory } from '@/lib/types';
import screenGamesData from '@/data/screen-games.json';

export const metadata: Metadata = {
  title: 'Skjermleker: Spill til Film, TV og Sport | GameNight',
  description: 'Gjør filmkvelden, TV-tittingen eller fotballkampen enda mer engasjerende med våre partyspill for skjerm. Enkle regler, garantert god stemning.',
};

export default function SkjermlekerPage() {
  const categories: ScreenGameCategory[] = screenGamesData.categories;
  return <SkjermlekerClient categories={categories} />;
}
