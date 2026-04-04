import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { GameEditorClient } from '@/components/editor/GameEditorClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Game editor - Lokal GameNight-editor',
  description:
    'Lokal editor for å lage og vedlikeholde egne GameNight-spill.',
  path: '/lokal/game-editor',
  noindex: true,
});

export default function GameEditorPage() {
  return <GameEditorClient />;
}
