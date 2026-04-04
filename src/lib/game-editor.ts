import { z } from 'zod';
import type {
  Game,
  GameRule,
  GameTask,
  GameTaskMoment,
  GameTaskType,
  GameWarning,
} from './types';

export const GAME_TASK_TYPES = [
  'challenge',
  'prompt',
  'pointing',
  'never_have_i_ever',
  'truth_or_shot',
  'versus',
] as const satisfies readonly GameTaskType[];

export const GAME_TASK_TYPE_LABELS: Record<GameTaskType, string> = {
  challenge: 'Utfordring',
  prompt: 'Spørsmål',
  pointing: 'Pekelek',
  never_have_i_ever: 'Jeg har aldri',
  truth_or_shot: 'Sannhet eller shot',
  versus: 'Versus',
};

export const GAME_TASK_MOMENTS = [
  'impact',
  'chaos',
  'secret',
  'group',
] as const satisfies readonly GameTaskMoment[];

export const GAME_TASK_MOMENT_LABELS: Record<GameTaskMoment, string> = {
  impact: 'Impact',
  chaos: 'Kaos',
  secret: 'Hemmelig',
  group: 'Gruppe',
};

export const GAME_INTENSITIES = ['low', 'medium', 'high'] as const;
export const GAME_AUDIENCES = ['all', '18+'] as const;
export const GAME_TYPES = [
  'default',
  'versus',
  'spin-the-bottle',
  'physical-item',
] as const;
export const SPIN_MODES = ['choose', 'virtual', 'physical'] as const;
export const RULE_ACTIONS = ['activate', 'clear'] as const;

export const PLACEHOLDER_TOKENS = [
  { token: '{player}', label: 'Spiller' },
  { token: '{player2}', label: 'Spiller 2' },
  { token: '{all}', label: 'Alle' },
  { token: '{team1}', label: 'Lag 1' },
  { token: '{team2}', label: 'Lag 2' },
] as const;

const gameRuleSchema = z.object({
  action: z.enum(RULE_ACTIONS),
  title: z.string().trim().min(1, 'Regler trenger en tittel.'),
  description: z.string().trim().min(1, 'Regler trenger en beskrivelse.'),
  duration: z.number().int().positive().nullable().optional(),
  category: z.string().trim().min(1).optional(),
  replacesCategories: z.array(z.string().trim().min(1)).optional(),
});

const gameTaskSchema = z.object({
  type: z.enum(GAME_TASK_TYPES),
  text: z.string().trim().min(1, 'Hvert kort må ha tekst.'),
  rule: gameRuleSchema.optional(),
  moment: z.enum(GAME_TASK_MOMENTS).optional(),
});

const gameWarningSchema = z.object({
  title: z.string().trim().min(1, 'Warning trenger en tittel.'),
  description: z
    .array(z.string().trim().min(1))
    .min(1, 'Warning trenger minst én linje.'),
  buttonText: z.string().trim().min(1, 'Warning trenger knappetekst.'),
});

const gameSchema = z
  .object({
    id: z.string().trim().min(1, 'Spill-ID må fylles ut.'),
    title: z.string().trim().min(1, 'Spilltittel må fylles ut.'),
    description: z.string().trim().min(1, 'Beskrivelse må fylles ut.'),
    language: z.string().trim().min(1, 'Språk må fylles ut.'),
    items: z.array(gameTaskSchema).min(1, 'Spillet må ha minst ett kort.'),
    shuffle: z.boolean().optional(),
    requiresPlayers: z.boolean().optional(),
    minPlayers: z.number().int().positive().optional(),
    emoji: z.string().trim().min(1).optional(),
    color: z.string().trim().min(1).optional(),
    hidden: z.boolean().optional(),
    intensity: z.enum(GAME_INTENSITIES),
    audience: z.enum(GAME_AUDIENCES),
    category: z
      .array(z.string().trim().min(1))
      .min(1, 'Velg minst én kategori.'),
    warning: gameWarningSchema.optional(),
    gameType: z.enum(GAME_TYPES).optional(),
    spinMode: z.enum(SPIN_MODES).optional(),
    teams: z
      .object({
        team1: z.string().trim().min(1, 'Lag 1 må ha navn.'),
        team2: z.string().trim().min(1, 'Lag 2 må ha navn.'),
        team1Color: z.string().trim().min(1).optional(),
        team2Color: z.string().trim().min(1).optional(),
      })
      .optional(),
    custom: z.boolean().optional(),
    instagram: z.string().trim().min(1).optional(),
    logo: z.string().trim().min(1).optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
    isHiddenFromMain: z.boolean().optional(),
    region: z.string().trim().min(1).optional(),
    kommune: z.string().trim().min(1).optional(),
  })
  .superRefine((game, ctx) => {
    if (game.gameType === 'versus') {
      if (!game.teams) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['teams'],
          message: 'Lagspill trenger to lag.',
        });
      }
    }

    if (game.gameType === 'spin-the-bottle' && !game.spinMode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['spinMode'],
        message: 'Spinn flasken-spill trenger spinMode.',
      });
    }
  });

export function createBlankTask(type: GameTaskType = 'challenge'): GameTask {
  return {
    type,
    text: '',
  };
}

export function createBlankWarning(): GameWarning {
  return {
    title: '',
    description: [''],
    buttonText: '',
  };
}

export function createBlankRule(): GameRule {
  return {
    action: 'activate',
    title: '',
    description: '',
    duration: 3,
    category: '',
    replacesCategories: [],
  };
}

export function createBlankGame(): Game {
  return {
    id: '',
    title: 'Nytt spill',
    description: '',
    language: 'no',
    items: [createBlankTask()],
    shuffle: true,
    requiresPlayers: true,
    minPlayers: 2,
    emoji: '🎉',
    color: 'hsl(0 84% 60%)',
    intensity: 'medium',
    audience: '18+',
    category: ['Party'],
    gameType: 'default',
    tags: [],
  };
}

function compactString(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function compactStringArray(values?: string[] | null): string[] | undefined {
  const normalized = (values ?? []).map((value) => value.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : undefined;
}

function sanitizeRule(rule?: GameRule): GameRule | undefined {
  if (!rule) {
    return undefined;
  }

  const sanitized: GameRule = {
    action: rule.action,
    title: rule.title.trim(),
    description: rule.description.trim(),
  };

  if (rule.action === 'activate') {
    if (typeof rule.duration === 'number' && Number.isFinite(rule.duration)) {
      sanitized.duration = rule.duration;
    }

    const category = compactString(rule.category);
    if (category) {
      sanitized.category = category;
    }

    const replacesCategories = compactStringArray(rule.replacesCategories);
    if (replacesCategories) {
      sanitized.replacesCategories = replacesCategories;
    }
  }

  return sanitized;
}

function sanitizeTask(task: GameTask): GameTask {
  const sanitized: GameTask = {
    type: task.type,
    text: task.text.trim(),
  };

  if (task.moment) {
    sanitized.moment = task.moment;
  }

  const rule = sanitizeRule(task.rule);
  if (rule) {
    sanitized.rule = rule;
  }

  return sanitized;
}

export function sanitizeGameForExport(game: Game): Game {
  const sanitized: Game = {
    id: game.id.trim(),
    title: game.title.trim(),
    description: game.description.trim(),
    language: game.language.trim(),
    items: game.items.map(sanitizeTask),
    shuffle: Boolean(game.shuffle),
    requiresPlayers: Boolean(game.requiresPlayers),
    intensity: game.intensity,
    audience: game.audience,
    category: compactStringArray(game.category) ?? [],
  };

  if (typeof game.minPlayers === 'number' && Number.isFinite(game.minPlayers)) {
    sanitized.minPlayers = game.minPlayers;
  }

  const emoji = compactString(game.emoji);
  if (emoji) {
    sanitized.emoji = emoji;
  }

  const color = compactString(game.color);
  if (color) {
    sanitized.color = color;
  }

  if (game.hidden) {
    sanitized.hidden = true;
  }

  if (game.isHiddenFromMain) {
    sanitized.isHiddenFromMain = true;
  }

  if (game.custom) {
    sanitized.custom = true;
  }

  const warningTitle = compactString(game.warning?.title);
  const warningDescription = compactStringArray(game.warning?.description);
  const warningButtonText = compactString(game.warning?.buttonText);
  if (warningTitle || warningDescription || warningButtonText) {
    sanitized.warning = {
      title: warningTitle ?? '',
      description: warningDescription ?? [],
      buttonText: warningButtonText ?? '',
    };
  }

  const gameType = compactString(game.gameType);
  if (gameType && gameType !== 'default') {
    sanitized.gameType = gameType as Game['gameType'];
  }

  if (game.gameType === 'spin-the-bottle') {
    sanitized.spinMode = (compactString(game.spinMode) as Game['spinMode']) ?? 'choose';
  }

  if (game.gameType === 'versus') {
    sanitized.teams = {
      team1: game.teams?.team1?.trim() ?? '',
      team2: game.teams?.team2?.trim() ?? '',
    };

    const team1Color = compactString(game.teams?.team1Color);
    const team2Color = compactString(game.teams?.team2Color);

    if (team1Color) {
      sanitized.teams.team1Color = team1Color;
    }

    if (team2Color) {
      sanitized.teams.team2Color = team2Color;
    }
  }

  const instagram = compactString(game.instagram);
  if (instagram) {
    sanitized.instagram = instagram;
  }

  const logo = compactString(game.logo);
  if (logo) {
    sanitized.logo = logo;
  }

  const tags = compactStringArray(game.tags);
  if (tags) {
    sanitized.tags = tags;
  }

  const region = compactString(game.region);
  if (region) {
    sanitized.region = region;
  }

  const kommune = compactString(game.kommune);
  if (kommune) {
    sanitized.kommune = kommune;
  }

  return sanitized;
}

export function validateGame(game: Game) {
  return gameSchema.safeParse(sanitizeGameForExport(game));
}

export function parseImportedGame(rawJson: string): Game {
  const parsed = JSON.parse(rawJson) as unknown;
  const validated = gameSchema.parse(parsed);
  return normalizeImportedGame(validated);
}

export function normalizeImportedGame(game: Game): Game {
  return {
    ...createBlankGame(),
    ...game,
    items: (game.items ?? []).map((task) => ({
      ...createBlankTask(task.type),
      ...task,
      rule: task.rule
        ? {
            ...createBlankRule(),
            ...task.rule,
            replacesCategories: task.rule.replacesCategories ?? [],
          }
        : undefined,
    })),
    warning: game.warning
      ? {
          ...createBlankWarning(),
          ...game.warning,
          description:
            game.warning.description.length > 0 ? game.warning.description : [''],
        }
      : undefined,
    teams:
      game.gameType === 'versus'
        ? {
            team1: game.teams?.team1 ?? 'Lag A',
            team2: game.teams?.team2 ?? 'Lag B',
            team1Color: game.teams?.team1Color ?? '',
            team2Color: game.teams?.team2Color ?? '',
          }
        : game.teams,
    tags: game.tags ?? [],
    category: game.category ?? ['Party'],
    gameType: game.gameType ?? 'default',
  };
}

export function buildExportJson(game: Game): string {
  const validated = validateGame(game);

  if (!validated.success) {
    throw new Error(formatValidationIssues(validated.error.issues));
  }

  return JSON.stringify(validated.data, null, 2);
}

export function formatValidationIssues(
  issues: Array<{ message: string; path?: Array<string | number> }>
) {
  return issues
    .map((issue) => {
      const path = issue.path?.length ? `${issue.path.join('.')}: ` : '';
      return `${path}${issue.message}`;
    })
    .join('\n');
}

export function splitCsvInput(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugifyGameName(value: string) {
  return value
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function createTaskByType(type: GameTaskType) {
  return createBlankTask(type);
}

function replacePreviewToken(
  text: string,
  game: Pick<Game, 'teams'>
) {
  return text
    .replaceAll('{player}', 'Spiller 1')
    .replaceAll('{player2}', 'Spiller 2')
    .replaceAll('{all}', 'Alle')
    .replaceAll('{team1}', game.teams?.team1 || 'Lag A')
    .replaceAll('{team2}', game.teams?.team2 || 'Lag B');
}

export function buildPreviewTask(task: GameTask, game: Pick<Game, 'teams'>): GameTask {
  return {
    ...task,
    text: replacePreviewToken(task.text, game),
    rule: task.rule
      ? {
          ...task.rule,
          title: replacePreviewToken(task.rule.title, game),
          description: replacePreviewToken(task.rule.description, game),
        }
      : undefined,
  };
}
