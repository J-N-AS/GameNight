import { notFound } from 'next/navigation';
import type { Game } from './types';
import { cache } from 'react';
import { getGameTier } from './game-library';

// Helper function to dynamically import game data
async function loadGameData(id: string): Promise<Game | null> {
  try {
    const gameModule = await import(`@/data/${id}.json`);
    return gameModule.default as Game;
  } catch (error) {
    // We don't log here anymore as it can be noisy for files that are expected to not exist
    // (e.g. if a game is removed from the list but the file isn't deleted yet)
    return null;
  }
}

type LegacyGameAlias = {
  targetId: string;
  overrides?: Partial<Game>;
};

// Hardcoded lists of game IDs.
// This is more maintainable than reading the file system in a serverless environment.
const canonicalGameIds = [
  'after-dark',
  'afterparty',
  'bursdags-roast',
  'datingfail',
  'fadderkampen',
  'fyllevalg',
  'girl-power',
  'gutta',
  'hemmelig-bonus',
  'hemmeligheter',
  'hyttekos-afterski',
  'icebreakeren',
  'jeg-har-aldri',
  'julebord',
  'kaosrunden',
  'kjapp-party-runde',
  'lagduell',
  'party-klassikere',
  'pekefest',
  'pest-eller-kolera',
  'rolig-sosial',
  'sannhet-eller-shot',
  'sexy-action',
  'sexy-dares',
  'sexy-vibes',
  'singles-body',
  'singles-night',
  'spinn-flasken',
  'spinn-flasken-action',
  'spinn-flasken-sannhet',
  'snusboksen',
  'snusboksen-utfordring',
  'snusboksen-sannhet',
  'vorspiel-mix',
] as const;

const legacyGameAliases: Record<string, LegacyGameAlias> = {
  'girls-vs-boys': {
    targetId: 'lagduell',
  },
  'spinn-flasken-ekte': {
    targetId: 'spinn-flasken',
    overrides: {
      title: 'Spinn Flasken (Ekte Flaske)',
      description:
        'Finn frem en ekte flaske! Spinn den på gulvet, og den personen flasken peker på må utføre oppgaven som vises på skjermen.',
      hidden: true,
      emoji: '🍾',
      spinMode: 'physical',
    },
  },
  'spinn-flasken-virtuell': {
    targetId: 'spinn-flasken',
    overrides: {
      title: 'Spinn Flasken (Virtuell)',
      description:
        'Ingen ekte flaske? Ikke noe problem. La den digitale flasken bestemme skjebnen din. Personen flasken peker på utfører oppgaven.',
      hidden: true,
      emoji: '📲',
      spinMode: 'virtual',
    },
  },
};

const canonicalGameIdSet = new Set<string>(canonicalGameIds);

async function loadResolvedGameData(id: string): Promise<Game | null> {
  const alias = legacyGameAliases[id];

  if (!alias) {
    return loadGameData(id);
  }

  const canonicalGame = await loadGameData(alias.targetId);
  if (!canonicalGame) {
    return null;
  }

  return {
    ...canonicalGame,
    ...alias.overrides,
    id,
  };
}

export function getAllGameRouteIds(): string[] {
  return [...canonicalGameIds, ...Object.keys(legacyGameAliases)];
}

export function getCanonicalGameId(id: string): string {
  const normalizedId = id.toLowerCase();
  return legacyGameAliases[normalizedId]?.targetId ?? normalizedId;
}


export const getGames = cache(async (options: { includeHidden?: boolean; includeHiddenFromMain?: boolean } = {}): Promise<Omit<Game, 'items' | 'language' | 'shuffle'>[]> => {
  const games = await Promise.all(
    canonicalGameIds.map(async (id) => {
      const gameData = await loadGameData(id);
      
      // Filter out games that don't load or have no items.
      if (!gameData || !gameData.items || gameData.items.length === 0) {
        return null;
      }
      
      // Special handling for hidden games, mainly for theme pages.
      if (gameData.hidden && !options.includeHidden) {
          return null;
      }

      if (gameData.isHiddenFromMain && !options.includeHiddenFromMain) {
        return null;
      }
      
      // Return a stripped-down version of the game data for lobby/listing pages
      return {
        id: gameData.id, // Use the ID from the file for consistency
        title: gameData.title,
        description: gameData.description,
        requiresPlayers: gameData.requiresPlayers,
        minPlayers: gameData.minPlayers,
        emoji: gameData.emoji,
        color: gameData.color,
        hidden: gameData.hidden,
        intensity: gameData.intensity,
        audience: gameData.audience,
        category: gameData.category,
        gameType: gameData.gameType,
        teams: gameData.teams,
        custom: gameData.custom,
        tags: gameData.tags,
        logo: gameData.logo,
        instagram: gameData.instagram,
        isHiddenFromMain: gameData.isHiddenFromMain,
        region: gameData.region,
        kommune: gameData.kommune,
      };
    })
  );

  const validGames = games.filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];

  // Sort the games to place "spicy" ones lower in the list
  const intensityOrder = { low: 1, medium: 2, high: 3 };
  const audienceOrder = { all: 1, '18+': 2 };

  validGames.sort((a, b) => {
    const tierComparison = getGameTier(a.id) - getGameTier(b.id);
    if (tierComparison !== 0) return tierComparison;

    const audienceComparison = audienceOrder[a.audience] - audienceOrder[b.audience];
    if (audienceComparison !== 0) return audienceComparison;

    const intensityComparison = intensityOrder[a.intensity] - intensityOrder[b.intensity];
    if (intensityComparison !== 0) return intensityComparison;

    return a.title.localeCompare(b.title);
  });

  return validGames;
});

export const getGame = cache(async (id: string): Promise<Game> => {
  const normalizedId = id.toLowerCase();
  
  // Check against the master list first for security and performance
  if (
    canonicalGameIdSet.has(normalizedId) ||
    Object.hasOwn(legacyGameAliases, normalizedId)
  ) {
    const gameData = await loadResolvedGameData(normalizedId);
    if (gameData) {
      return gameData;
    }
  }

  // If we reach here, the game ID is not valid or the file is missing.
  notFound();
});
