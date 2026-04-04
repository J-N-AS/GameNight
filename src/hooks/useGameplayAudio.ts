'use client';

import { useCallback, useEffect, useRef } from 'react';

type GameplayAudioCue = 'card' | 'impact' | 'timer';

type CueStep = {
  delayMs?: number;
  durationMs: number;
  frequency: number;
  type?: OscillatorType;
  volume: number;
};

const cueMap: Record<GameplayAudioCue, CueStep[]> = {
  card: [
    {
      frequency: 620,
      durationMs: 80,
      type: 'triangle',
      volume: 0.02,
    },
    {
      delayMs: 90,
      frequency: 820,
      durationMs: 60,
      type: 'sine',
      volume: 0.015,
    },
  ],
  impact: [
    {
      frequency: 340,
      durationMs: 90,
      type: 'square',
      volume: 0.022,
    },
    {
      delayMs: 85,
      frequency: 520,
      durationMs: 120,
      type: 'sawtooth',
      volume: 0.018,
    },
    {
      delayMs: 180,
      frequency: 760,
      durationMs: 160,
      type: 'triangle',
      volume: 0.02,
    },
  ],
  timer: [
    {
      frequency: 880,
      durationMs: 110,
      type: 'sine',
      volume: 0.016,
    },
    {
      delayMs: 120,
      frequency: 1175,
      durationMs: 120,
      type: 'sine',
      volume: 0.018,
    },
    {
      delayMs: 250,
      frequency: 1568,
      durationMs: 220,
      type: 'triangle',
      volume: 0.022,
    },
  ],
};

type LegacyAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function scheduleTone(context: AudioContext, step: CueStep, baseTime: number) {
  const startAt = baseTime + (step.delayMs ?? 0) / 1000;
  const stopAt = startAt + step.durationMs / 1000;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = step.type ?? 'sine';
  oscillator.frequency.setValueAtTime(step.frequency, startAt);

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(step.volume, startAt + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startAt);
  oscillator.stop(stopAt + 0.03);
}

export function useGameplayAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    if (
      audioContextRef.current &&
      audioContextRef.current.state !== 'closed'
    ) {
      return audioContextRef.current;
    }

    const AudioContextConstructor =
      window.AudioContext ||
      (window as LegacyAudioWindow).webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    const context = new AudioContextConstructor();
    audioContextRef.current = context;

    return context;
  }, []);

  const prime = useCallback(async () => {
    const context = getAudioContext();

    if (!context) {
      return false;
    }

    if (context.state !== 'running') {
      try {
        await context.resume();
      } catch {
        return false;
      }
    }

    return context.state === 'running';
  }, [getAudioContext]);

  const play = useCallback(
    async (cue: GameplayAudioCue) => {
      const context = getAudioContext();

      if (!context) {
        return false;
      }

      if (context.state !== 'running') {
        try {
          await context.resume();
        } catch {
          return false;
        }
      }

      const baseTime = context.currentTime + 0.01;

      cueMap[cue].forEach((step) => {
        scheduleTone(context, step, baseTime);
      });

      return true;
    },
    [getAudioContext]
  );

  useEffect(() => {
    return () => {
      const context = audioContextRef.current;

      if (context && context.state !== 'closed') {
        void context.close().catch(() => undefined);
      }
    };
  }, []);

  return {
    prime,
    playCard: () => play('card'),
    playImpact: () => play('impact'),
    playTimerFinished: () => play('timer'),
  };
}
