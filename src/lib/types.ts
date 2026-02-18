// This file can be used to share types between server and client components.

export interface GameTask {
  type: 'challenge' | 'never_have_i_ever' | 'prompt' | 'pointing';
  text: string;
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
