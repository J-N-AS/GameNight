'use client';

import type { Game } from '@/lib/types';
import { useEffect, useState } from 'react';
import { GameClient } from './GameClient';
import { GameConsentScreen } from './GameConsentScreen';
import { GameModeSelectionScreen } from './GameModeSelectionScreen';
import { GameInstructionScreen } from './GameInstructionScreen';
import { CustomGameLobby } from './CustomGameLobby';
import { Smartphone, GlassWater, Package } from 'lucide-react';
import { useSession } from '@/hooks/usePlayers';
import { GameRequiresPlayersScreen } from './GameRequiresPlayersScreen';
import { hasEnoughPlayers } from '@/lib/player-requirements';

type GameStep = 'consent' | 'mode_select' | 'instruction' | 'lobby' | 'playing';

type SpinMode = 'virtual' | 'physical' | null;

function getPresetSpinMode(game: Game): SpinMode {
  if (game.gameType !== 'spin-the-bottle') {
    return null;
  }

  if (game.spinMode === 'virtual' || game.spinMode === 'physical') {
    return game.spinMode;
  }

  return null;
}

function getStepAfterConsent(game: Game): GameStep {
  const hasPresetSpinMode = getPresetSpinMode(game) !== null;

  if (game.gameType === 'spin-the-bottle' && !hasPresetSpinMode) {
    return 'mode_select';
  }

  if (game.gameType === 'physical-item') {
    return 'instruction';
  }

  if (game.custom) {
    return 'lobby';
  }

  return 'playing';
}

export function GameFlow({ game }: { game: Game }) {
  const { players, isLoaded } = useSession();

  const presetSpinMode = getPresetSpinMode(game);

  const [step, setStep] = useState<GameStep>(() => {
    if (game.warning) {
      return 'consent';
    }

    return getStepAfterConsent(game);
  });

  const [gameMode, setGameMode] = useState<SpinMode>(presetSpinMode);

  useEffect(() => {
    document.body.classList.toggle('gameplay-active', step === 'playing');

    return () => {
      document.body.classList.remove('gameplay-active');
    };
  }, [step]);

  const advanceStep = () => {
    switch (step) {
      case 'consent':
        setStep(getStepAfterConsent(game));
        break;
      case 'mode_select':
      case 'instruction':
      case 'lobby':
        setStep('playing');
        break;
      default:
        setStep('playing');
    }
  };

  if (isLoaded && !hasEnoughPlayers(game, players.length)) {
    return <GameRequiresPlayersScreen game={game} />;
  }

  switch (step) {
    case 'consent':
      return <GameConsentScreen warning={game.warning!} onConfirm={advanceStep} />;

    case 'mode_select':
      return (
        <GameModeSelectionScreen
          title="Spinn Flasken"
          description="Hvordan vil dere spille? Velg om dere bruker en ekte, fysisk flaske eller den virtuelle flasken på skjermen."
          options={[
            {
              id: 'virtual',
              icon: <Smartphone className="h-8 w-8 text-primary" />,
              title: 'Bruk Virtuell Flaske',
              description:
                'Spill med en animert flaske på skjermen. Perfekt hvis dere ikke har en flaske tilgjengelig.',
            },
            {
              id: 'physical',
              icon: <GlassWater className="h-8 w-8 text-primary" />,
              title: 'Bruk Ekte Flaske',
              description:
                'Bruk en fysisk flaske. Spillet vil kun vise oppgavene etter at dere har spunnet selv.',
            },
          ]}
          onModeSelect={(mode) => {
            setGameMode(mode as 'virtual' | 'physical');
            advanceStep();
          }}
        />
      );

    case 'instruction':
      return (
        <GameInstructionScreen
          icon={<Package className="h-12 w-12 text-primary" />}
          title="Gjør dere klare!"
          description="Dette spillet krever en liten gjenstand, som en snusboks eller en myk ball, som kan kastes trygt mellom dere. Finn en gjenstand og trykk start når dere er klare."
          buttonText="Start Spillet"
          onConfirm={advanceStep}
        />
      );

    case 'lobby':
      return <CustomGameLobby game={game} onStart={advanceStep} />;

    case 'playing':
      return <GameClient game={game} gameMode={gameMode} />;

    default:
      return <p>Laster spill...</p>;
  }
}
