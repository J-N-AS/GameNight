import { formatSipAmount } from './gameplay-preferences';
import type { GameArticle, PlayerCountRange } from './types';

export type DrikkelekListItem = Omit<
  GameArticle,
  'whatYouNeed' | 'rules' | 'cardRules' | 'variants' | 'attributionHtml'
>;

export type DrikkelekGroupSizeFilter = 'all' | '2-4' | '5-8' | '9+';

export const drikkelekGroupSizeOptions: Array<{
  value: DrikkelekGroupSizeFilter;
  label: string;
}> = [
  { value: 'all', label: 'Alle grupper' },
  { value: '2-4', label: '2-4 spillere' },
  { value: '5-8', label: '5-8 spillere' },
  { value: '9+', label: '9+ spillere' },
];

export function getArticlePlayerLabel(players?: PlayerCountRange): string | null {
  if (!players) {
    return null;
  }

  if (players.label?.trim()) {
    return players.label.trim();
  }

  if (typeof players.min === 'number' && typeof players.max === 'number') {
    return `${players.min}-${players.max} spillere`;
  }

  if (typeof players.min === 'number') {
    return `${players.min}+ spillere`;
  }

  if (typeof players.max === 'number') {
    return `Opptil ${players.max} spillere`;
  }

  return null;
}

function matchesPlayerRangeBucket(
  players: PlayerCountRange | undefined,
  filter: DrikkelekGroupSizeFilter
): boolean {
  if (!players || filter === 'all') {
    return true;
  }

  const min = players.min ?? 2;
  const max = players.max ?? Number.POSITIVE_INFINITY;

  if (filter === '2-4') {
    return min <= 4 && max >= 2;
  }

  if (filter === '5-8') {
    return min <= 8 && max >= 5;
  }

  return max >= 9;
}

function playerRangesOverlap(
  leftPlayers: PlayerCountRange | undefined,
  rightPlayers: PlayerCountRange | undefined
): boolean {
  if (!leftPlayers || !rightPlayers) {
    return false;
  }

  const leftMin = leftPlayers.min ?? 2;
  const leftMax = leftPlayers.max ?? Number.POSITIVE_INFINITY;
  const rightMin = rightPlayers.min ?? 2;
  const rightMax = rightPlayers.max ?? Number.POSITIVE_INFINITY;

  return leftMin <= rightMax && rightMin <= leftMax;
}

export function matchesArticleGroupSize(
  article: Pick<GameArticle, 'players'>,
  filter: DrikkelekGroupSizeFilter
): boolean {
  return matchesPlayerRangeBucket(article.players, filter);
}

export function getArticlePenaltyLabel(
  article: Pick<GameArticle, 'sipAmount' | 'penalty'>
): string | null {
  const tip = article.penalty?.trim();

  if (typeof article.sipAmount === 'number' && article.sipAmount > 0) {
    const amountLabel = formatSipAmount(article.sipAmount);
    return tip ? `${amountLabel} som standard. ${tip}` : amountLabel;
  }

  return tip ?? null;
}

function getRelatedArticleScore(
  baseArticle: DrikkelekListItem,
  candidate: DrikkelekListItem
): number {
  const baseTags = new Set(baseArticle.tags ?? []);
  const candidateTags = candidate.tags ?? [];
  let score = candidateTags.reduce(
    (total, tag) => (baseTags.has(tag) ? total + 3 : total),
    0
  );

  if (baseArticle.intensity && baseArticle.intensity === candidate.intensity) {
    score += 2;
  }

  if (playerRangesOverlap(baseArticle.players, candidate.players)) {
    score += 1;
  }

  return score;
}

export function getRelatedArticles(
  articles: DrikkelekListItem[],
  currentSlug: string,
  limit = 4
): Array<Pick<GameArticle, 'slug' | 'title'>> {
  const currentArticle = articles.find((article) => article.slug === currentSlug);

  return articles
    .filter((article) => article.slug !== currentSlug)
    .sort((left, right) => {
      if (!currentArticle) {
        return left.title.localeCompare(right.title, 'nb');
      }

      const scoreDifference =
        getRelatedArticleScore(currentArticle, right) -
        getRelatedArticleScore(currentArticle, left);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return left.title.localeCompare(right.title, 'nb');
    })
    .slice(0, limit)
    .map((article) => ({ slug: article.slug, title: article.title }));
}
