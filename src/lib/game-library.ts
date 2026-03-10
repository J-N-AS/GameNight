const CORE_GAME_IDS = [
  'party-klassikere',
  'pekefest',
  'vorspiel-mix',
  'icebreakeren',
  'jeg-har-aldri',
  'pest-eller-kolera',
  'kaosrunden',
  'snusboksen',
  'spinn-flasken',
] as const;

const TIER_THREE_GAME_IDS = [
  'datingfail',
  'fyllevalg',
  'girls-vs-boys',
  'hemmelig-bonus',
  'kjapp-party-runde',
  'rt-2025-dummy',
  'sexy-action',
  'singles-body',
  'spinn-flasken-ekte',
  'spinn-flasken-virtuell',
] as const;

const HOME_RECOMMENDED_GAME_IDS = [
  'party-klassikere',
  'pekefest',
  'spinn-flasken',
] as const;

const coreGameIdSet = new Set<string>(CORE_GAME_IDS);
const tierThreeGameIdSet = new Set<string>(TIER_THREE_GAME_IDS);
const homeRecommendedGameIdSet = new Set<string>(HOME_RECOMMENDED_GAME_IDS);

export type GameTier = 1 | 2 | 3;

export function getGameTier(gameId: string): GameTier {
  if (coreGameIdSet.has(gameId)) {
    return 1;
  }

  if (tierThreeGameIdSet.has(gameId)) {
    return 3;
  }

  return 2;
}

export function isCoreGame(gameId: string): boolean {
  return coreGameIdSet.has(gameId);
}

export function isHomeRecommendedGame(gameId: string): boolean {
  return homeRecommendedGameIdSet.has(gameId);
}

export function getHomeRecommendedOrder(gameId: string): number {
  const order = HOME_RECOMMENDED_GAME_IDS.indexOf(
    gameId as (typeof HOME_RECOMMENDED_GAME_IDS)[number]
  );

  return order === -1 ? Number.MAX_SAFE_INTEGER : order;
}

export function getGameTierLabel(gameId: string): string {
  switch (getGameTier(gameId)) {
    case 1:
      return 'Kjernevalg';
    case 3:
      return 'Skjult';
    default:
      return 'Temaspill';
  }
}

export const GAME_LIBRARY_TIERS = {
  tier1: CORE_GAME_IDS,
  tier3: TIER_THREE_GAME_IDS,
  homeRecommended: HOME_RECOMMENDED_GAME_IDS,
} as const;
