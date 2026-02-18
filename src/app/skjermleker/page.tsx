import type { Metadata } from 'next';
import { getScreenGames } from '@/lib/screen-games';
import { SkjermlekerClient } from '@/components/skjermleker/SkjermlekerClient';
import type { ScreenGameCategory } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Skjermleker: Spill til Film, TV og Sport | GameNight',
  description: 'Gjør filmkvelden, TV-tittingen eller fotballkampen enda mer engasjerende med våre partyspill for skjerm. Enkle regler, garantert god stemning.',
};

export default function SkjermlekerPage() {
  const categories: ScreenGameCategory[] = getScreenGames();
  return <SkjermlekerClient categories={categories} />;
}
