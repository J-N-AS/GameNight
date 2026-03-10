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

export interface GameArticle {
  slug: string;
  title: string;
  description: string;
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

export interface Theme {
  slug: string;
  title: string;
  metaDescription: string;
  content: string[];
  gameIds: string[];
  emoji: string;
}
