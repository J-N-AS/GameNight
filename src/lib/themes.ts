import type {
  Game,
  Theme,
  ThemeArticleBlock,
  ThemeArticleSectionBlock,
} from './types';
import themesData from '@/data/themes.json';
import { getGames } from './games';
import { cache } from 'react';

export type ThemeWithGames = Theme & {
  games: Omit<Game, 'items' | 'language' | 'shuffle'>[];
  articleBlocks: ThemeArticleBlock[];
};

export const getThemes = cache(async (): Promise<Theme[]> => {
  return themesData.themes as Theme[];
});

function isLegacyThemeContent(content: Theme['content']): content is string[] {
  return content.every((block) => typeof block === 'string');
}

function getThemeLabel(theme: Theme): string {
  if (theme.slug === 'spicy-18-pluss') {
    return '18+ kvelden';
  }

  return theme.slug
    .replace(/-/g, ' ')
    .replace(/\b18 pluss\b/gi, '18+')
    .trim();
}

function getFallbackHeading(theme: Theme, sectionIndex: number): string {
  const themeLabel = getThemeLabel(theme);

  switch (sectionIndex) {
    case 0:
      return 'Slik får dere i gang kvelden';
    case 1:
      return `De beste lekene for ${themeLabel}`;
    case 2:
      return 'Når dere vil løfte stemningen';
    case 3:
      return 'Slik holder dere energien oppe';
    default:
      return `Flere tips til ${themeLabel}`;
  }
}

function insertDefaultPromos(
  blocks: ThemeArticleBlock[],
  gameIds: string[]
): ThemeArticleBlock[] {
  const totalSections = blocks.filter(
    (block): block is ThemeArticleSectionBlock => block.type === 'section'
  ).length;

  if (totalSections < 2) {
    return blocks;
  }

  let seenSections = 0;

  return blocks.flatMap((block) => {
    if (block.type !== 'section') {
      return [block];
    }

    seenSections += 1;
    const nextBlocks: ThemeArticleBlock[] = [block];
    const deckId = gameIds[seenSections - 1];

    if (seenSections < totalSections && deckId) {
      nextBlocks.push({
        type: 'promo',
        deckId,
      });
    }

    return nextBlocks;
  });
}

function normalizeThemeContent(theme: Theme): ThemeArticleBlock[] {
  if (isLegacyThemeContent(theme.content)) {
    const sectionBlocks = theme.content.flatMap(
      (paragraph, index): ThemeArticleBlock[] => {
        const trimmedParagraph = paragraph.trim();

        if (!trimmedParagraph) {
          return [];
        }

        return [
          {
            type: 'section',
            heading: getFallbackHeading(theme, index),
            paragraphs: [trimmedParagraph],
          },
        ];
      }
    );

    return insertDefaultPromos(sectionBlocks, theme.gameIds);
  }

  let sectionIndex = 0;

  const normalizedBlocks = theme.content.flatMap(
    (block): ThemeArticleBlock[] => {
      if (block.type === 'section') {
        const paragraphs = block.paragraphs
          .map((paragraph) => paragraph.trim())
          .filter(Boolean);

        if (paragraphs.length === 0) {
          return [];
        }

        const heading =
          block.heading?.trim() || getFallbackHeading(theme, sectionIndex);
        sectionIndex += 1;

        return [
          {
            type: 'section',
            heading,
            paragraphs,
          },
        ];
      }

      const deckId = block.deckId.trim();

      if (!deckId) {
        return [];
      }

      return [
        {
          ...block,
          deckId,
          ctaLabel: block.ctaLabel?.trim() || undefined,
        },
      ];
    }
  );

  const hasExplicitPromo = normalizedBlocks.some(
    (block) => block.type === 'promo'
  );

  if (hasExplicitPromo) {
    return normalizedBlocks;
  }

  return insertDefaultPromos(normalizedBlocks, theme.gameIds);
}

export const getTheme = cache(async (slug: string): Promise<ThemeWithGames | undefined> => {
  const themes = await getThemes();
  const theme = themes.find(t => t.slug === slug);

  if (!theme) {
    return undefined;
  }

  // Fetch all games, INCLUDING hidden ones, to match against theme.gameIds
  const allGames = await getGames({ includeHidden: true, includeHiddenFromMain: true });
  
  // We should also respect the order from gameIds
  const orderedGames = theme.gameIds
    .map(id => allGames.find(game => game.id === id))
    .filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];

  return {
    ...theme,
    games: orderedGames,
    articleBlocks: normalizeThemeContent(theme),
  };
});
