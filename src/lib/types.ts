// This file can be used to share types between server and client components.

export type PlayerStats = {
  timesTargeted: number;
  tasksCompleted: number;
  penalties: number;
};

export type Player = {
  id: string;
  name: string;
  stats: PlayerStats;
};

export type GameTaskType =
  | 'challenge'
  | 'never_have_i_ever'
  | 'prompt'
  | 'pointing'
  | 'versus'
  | 'truth_or_shot';

export type GameTaskMoment = 'impact' | 'chaos' | 'secret' | 'group';

export interface GameRule {
  action: 'activate' | 'clear';
  title: string;
  description: string;
  duration?: number | null;
  category?: string;
  replacesCategories?: string[];
}

export interface GameTask {
  type: GameTaskType;
  text: string;
  rule?: GameRule;
  moment?: GameTaskMoment;
  timer?: number;
  sipAmount?: number;
  penalty?: string;
}

export interface GameWarning {
  title: string;
  description: string[];
  buttonText: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  language: string;
  items: GameTask[];
  shuffle?: boolean;
  requiresPlayers?: boolean;
  minPlayers?: number;
  emoji?: string;
  color?: string;
  hidden?: boolean;
  intensity: 'low' | 'medium' | 'high';
  audience: 'all' | '18+';
  category: string[];
  warning?: GameWarning;
  gameType?: 'default' | 'versus' | 'spin-the-bottle' | 'physical-item';
  spinMode?: 'choose' | 'virtual' | 'physical';
  teams?: {
    team1: string;
    team2: string;
    team1Color?: string;
    team2Color?: string;
  };
  custom?: boolean;
  instagram?: string;
  logo?: string;
  tags?: string[];
  isHiddenFromMain?: boolean;
  region?: string;
  kommune?: string;
}

export interface PlayerCountRange {
  min?: number;
  max?: number;
  label?: string;
}

export interface GameArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  editorialOwner: string;
  whatYouNeed: string[];
  rules: string[];
  cardRules?: { [key: string]: string };
  variants?: {
    title: string;
    description: string;
    rules: string[];
  }[];
  imageUrl?: string;
  imageHint?: string;
  attributionHtml?: string;
  intensity?: 'low' | 'medium' | 'high';
  players?: PlayerCountRange;
  tags?: string[];
  sipAmount?: number;
  penalty?: string;
}

export interface MusicGame {
  id: string;
  title: string;
  artist: string;
  rules: string;
  spotifyUrl: string;
}

export interface MusicGameCategory {
  title: string;
  games: MusicGame[];
}

export interface ScreenGame {
  id: string;
  title: string;
  artist: string;
  rules: string;
}

export interface ScreenGameCategory {
  title: string;
  games: ScreenGame[];
}

export interface ThemeArticleSectionBlock {
  type: 'section';
  heading?: string;
  paragraphs: string[];
}

export interface ThemeArticlePromoBlock {
  type: 'promo';
  deckId: string;
  ctaLabel?: string;
}

export type ThemeArticleBlock =
  | ThemeArticleSectionBlock
  | ThemeArticlePromoBlock;

export interface Theme {
  slug: string;
  title: string;
  metaDescription: string;
  content: string[] | ThemeArticleBlock[];
  gameIds: string[];
  emoji: string;
}
