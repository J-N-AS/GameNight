import type { Game, GameTask } from './types';

export type GameplayTone =
  | 'challenge'
  | 'never'
  | 'question'
  | 'pointing'
  | 'versus'
  | 'truth'
  | 'rule'
  | 'chaos'
  | 'secret';

export interface TaskPresentation {
  tone: GameplayTone;
  badge: string;
  title: string;
  hint: string;
  emoji: string;
}

export interface GameplayMoment {
  kind: 'impact' | 'chaos' | 'secret' | 'group' | 'rule' | 'duel';
  tone: GameplayTone;
  label: string;
  intro: string;
  hint: string;
  durationMs: number;
}

function hasCategory(game: Pick<Game, 'id' | 'category'> | undefined, value: string) {
  return Boolean(
    game?.category?.some((entry) => entry.toLowerCase() === value.toLowerCase())
  );
}

function isChaosDeck(game: Pick<Game, 'id' | 'category'> | undefined) {
  return game?.id === 'kaosrunden' || hasCategory(game, 'Kaos');
}

function inferImpactLabel(task: GameTask): string {
  const text = task.text.toLowerCase();

  if (text.includes('hevn')) {
    return 'HEVN';
  }

  if (text.includes('dobbelt') || text.includes('dobbel')) {
    return 'DOBBELTSTRAFF';
  }

  if (text.includes('mini-runde') || text.includes('minirunde')) {
    return 'MINIRUNDE';
  }

  return 'SPESIALKORT';
}

export function getTaskPresentation(
  task: GameTask,
  game?: Pick<Game, 'id' | 'category'>
): TaskPresentation {
  if (task.rule) {
    return {
      tone: 'rule',
      badge: task.rule.action === 'clear' ? 'Reset' : 'Regel',
      title: task.rule.action === 'clear' ? 'Regelpause' : 'Running rule',
      hint:
        task.rule.action === 'clear'
          ? 'Gamle regler ryddes før neste runde.'
          : 'Denne regelen lever videre etter at kortet er borte.',
      emoji: task.rule.action === 'clear' ? '🧹' : '🧩',
    };
  }

  if (task.moment === 'secret') {
    return {
      tone: 'secret',
      badge: 'Hemmelig',
      title: 'Bonuskort',
      hint: 'Dette kortet setter spor litt lenger enn normalt.',
      emoji: '💎',
    };
  }

  if (task.moment === 'chaos' || (isChaosDeck(game) && task.type === 'challenge')) {
    return {
      tone: 'chaos',
      badge: 'Kaoskort',
      title: 'Kaos',
      hint: 'Kort, hardt og litt farligere enn vanlig.',
      emoji: '💥',
    };
  }

  switch (task.type) {
    case 'challenge':
      return {
        tone: 'challenge',
        badge: 'Utfordring',
        title: 'Action',
        hint: 'Gjør kortet med en gang.',
        emoji: '🔥',
      };
    case 'never_have_i_ever':
      return {
        tone: 'never',
        badge: 'Bekjennelse',
        title: 'Jeg har aldri...',
        hint: 'De som kjenner seg igjen, tar runden.',
        emoji: '🍷',
      };
    case 'prompt':
      return {
        tone: 'question',
        badge: 'Spørsmål',
        title: 'Spørsmål',
        hint: 'Svar høyt før dere går videre.',
        emoji: '❄️',
      };
    case 'pointing':
      return {
        tone: 'pointing',
        badge: 'Pekelek',
        title: 'Pek ut',
        hint: 'Pek samtidig og stol på magefølelsen.',
        emoji: '👉',
      };
    case 'versus':
      return {
        tone: 'versus',
        badge: 'Duell',
        title: 'Versus',
        hint: 'Finn en vinner før neste kort.',
        emoji: '⚔️',
      };
    case 'truth_or_shot':
      return {
        tone: 'truth',
        badge: 'Presskort',
        title: 'Sannhet eller shot',
        hint: 'Svar ærlig eller ta straffen.',
        emoji: '🥃',
      };
    default:
      return {
        tone: 'challenge',
        badge: 'Utfordring',
        title: 'Action',
        hint: 'Gjør kortet med en gang.',
        emoji: '🔥',
      };
  }
}

export function getGameplayMoment(
  task: GameTask,
  game?: Pick<Game, 'id' | 'category'>
): GameplayMoment | null {
  const chaosDeck = isChaosDeck(game);
  const lowerText = task.text.toLowerCase();

  if (task.rule) {
    const isReset = task.rule.action === 'clear';

    return {
      kind: 'rule',
      tone: isReset ? 'rule' : chaosDeck ? 'chaos' : 'rule',
      label: isReset ? 'REGELRESET' : chaosDeck ? 'KAOSREGEL' : 'NY REGEL',
      intro: isReset
        ? 'Bordet nullstilles før neste trekk.'
        : 'Dette kortet blir med videre i spillet.',
      hint: isReset
        ? 'Se aktive regler øverst for å bekrefte at de er borte.'
        : 'Hold et øye med aktive regler mens dere spiller videre.',
      durationMs: isReset ? 620 : 720,
    };
  }

  if (task.type === 'versus') {
    return {
      kind: 'duel',
      tone: 'versus',
      label: 'DUELL',
      intro: 'To sider går mot hverandre i denne runden.',
      hint: 'Stem frem vinneren før neste kort.',
      durationMs: 620,
    };
  }

  if (task.moment === 'secret') {
    return {
      kind: 'secret',
      tone: 'secret',
      label: 'HEMMELIG OPPDRAG',
      intro: 'Dette kortet endrer stemningen litt lenger enn vanlig.',
      hint: 'La gruppa reagere før dere setter det i spill.',
      durationMs: 760,
    };
  }

  if (task.moment === 'chaos') {
    return {
      kind: 'chaos',
      tone: 'chaos',
      label: 'KAOSKORT',
      intro: 'Nå skrur dere opp tempoet og lar bordet skli litt.',
      hint: 'Les kortet høyt og gi det et lite ekstra øyeblikk.',
      durationMs: 680,
    };
  }

  if (task.moment === 'group') {
    return {
      kind: 'group',
      tone: chaosDeck ? 'chaos' : 'challenge',
      label: chaosDeck ? 'ALLE I KAOS' : 'ALLE INN',
      intro: 'Hele rommet er med på dette kortet.',
      hint: 'Ingen slipper unna denne runden.',
      durationMs: 620,
    };
  }

  if (task.moment === 'impact') {
    return {
      kind: 'impact',
      tone: chaosDeck ? 'chaos' : 'challenge',
      label: inferImpactLabel(task),
      intro: 'Dette kortet er ment å spilles litt større enn vanlig.',
      hint: 'Ta et halvt sekund og gi kortet mer scene.',
      durationMs: 620,
    };
  }

  if (
    chaosDeck &&
    task.type === 'challenge' &&
    /(alle bytter|alle reiser seg|alle lukker øynene|alle roper|ingen spørsmål|velg to andre spillere)/.test(
      lowerText
    )
  ) {
    return {
      kind: 'chaos',
      tone: 'chaos',
      label: 'KAOSKORT',
      intro: 'Dette kortet drar hele bordet i en ny retning.',
      hint: 'Kjør det raskt og tydelig.',
      durationMs: 650,
    };
  }

  return null;
}
