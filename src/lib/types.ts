// This file can be used to share types between server and client components.

export interface GameTask {
  type: 'challenge' | 'never_have_i_ever' | 'prompt' | 'pointing' | 'versus';
  text: string;
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
  emoji?: string;
  color?: string;
  hidden?: boolean;
  intensity: 'low' | 'medium' | 'high';
  audience: 'all' | '18+';
  category: string[];
  warning?: GameWarning;
  gameType?: 'default' | 'versus';
  teams?: {
    team1: string;
    team2: string;
  };
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
