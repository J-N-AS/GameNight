'use client';

import type React from 'react';
import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Braces,
  CircleMinus,
  CirclePlus,
  Copy,
  Download,
  Eye,
  FileJson,
  FolderOpen,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { withBasePath } from '@/lib/base-path';
import { cn } from '@/lib/utils';
import { TaskCard } from '@/components/game/TaskCard';
import { useToast } from '@/hooks/use-toast';
import type { Game, GameRule, GameTask, GameTaskType } from '@/lib/types';
import {
  buildPreviewTask,
  createBlankGame,
  createBlankRule,
  createBlankTask,
  createBlankWarning,
  formatValidationIssues,
  GAME_AUDIENCES,
  GAME_INTENSITIES,
  GAME_TASK_MOMENT_LABELS,
  GAME_TASK_MOMENTS,
  GAME_TASK_TYPE_LABELS,
  GAME_TASK_TYPES,
  GAME_TYPES,
  parseImportedGame,
  PLACEHOLDER_TOKENS,
  slugifyGameName,
  SPIN_MODES,
  splitCsvInput,
  splitLines,
  validateGame,
} from '@/lib/game-editor';
import { intensityStyles } from '@/lib/game-ui';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TextFieldElement = HTMLInputElement | HTMLTextAreaElement;

type ActiveTextField = {
  path: string;
  element: TextFieldElement | null;
  start: number;
  end: number;
};

const pathIndexPattern = /^\d+$/;

const taskTypeDescriptions: Record<GameTaskType, string> = {
  challenge: 'Actionkort som vanligvis ber noen gjøre noe med en gang.',
  prompt: 'Åpne spørsmål som holder tempoet oppe uten å bli for tekniske.',
  pointing: 'Pekelek der gruppen peker samtidig på den som passer best.',
  never_have_i_ever: 'Bekjennelseskort der de som kjenner seg igjen, reagerer.',
  truth_or_shot: 'Presskort med ærlig svar eller sosial straff.',
  versus: 'Avstemningskort som passer best i lagspill.',
};

function normalizePathSegment(segment: string): string | number {
  return pathIndexPattern.test(segment) ? Number(segment) : segment;
}

function readPathValue(source: unknown, path: string): unknown {
  return path
    .split('.')
    .map(normalizePathSegment)
    .reduce<unknown>((current, segment) => {
      if (current == null) {
        return undefined;
      }

      return (current as Record<string | number, unknown>)[segment];
    }, source);
}

function writePathValue<T>(source: T, path: string, value: unknown): T {
  const next = structuredClone(source);
  const segments = path.split('.').map(normalizePathSegment);
  let cursor: any = next;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    const currentValue = cursor[segment];

    if (currentValue == null) {
      cursor[segment] = typeof nextSegment === 'number' ? [] : {};
    }

    cursor = cursor[segment];
  }

  const lastSegment = segments[segments.length - 1];
  cursor[lastSegment] = value;

  return next;
}

function getIssueList(game: Game) {
  const validation = validateGame(game);

  if (validation.success) {
    return [];
  }

  return validation.error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

function buildExportJson(game: Game) {
  const validation = validateGame(game);

  if (!validation.success) {
    throw new Error(formatValidationIssues(validation.error.issues));
  }

  return JSON.stringify(validation.data, null, 2);
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground/80">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SectionLabel({
  htmlFor,
  title,
  hint,
  action,
}: {
  htmlFor?: string;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-start justify-between gap-3">
      <div>
        <Label htmlFor={htmlFor}>{title}</Label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function GameEditorClient() {
  const [game, setGame] = useState<Game>(() => createBlankGame());
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeTextFieldRef = useRef<ActiveTextField | null>(null);
  const { toast } = useToast();

  const selectedTask = game.items[selectedTaskIndex] ?? createBlankTask();
  const issueList = useMemo(() => getIssueList(game), [game]);

  const exportJson = useMemo(() => {
    try {
      return buildExportJson(game);
    } catch {
      return null;
    }
  }, [game]);

  const previewTask = useMemo(
    () => buildPreviewTask(selectedTask, { teams: game.teams }),
    [game.teams, selectedTask]
  );

  const downloadFileName = useMemo(() => {
    const fromId = game.id.trim();
    if (fromId) {
      return `${fromId}.json`;
    }

    const slug = slugifyGameName(game.title);
    return `${slug || 'gamenight-spill'}.json`;
  }, [game.id, game.title]);

  const rememberTextField = (path: string, element: TextFieldElement) => {
    activeTextFieldRef.current = {
      path,
      element,
      start: element.selectionStart ?? element.value.length,
      end: element.selectionEnd ?? element.value.length,
    };
  };

  const bindTextField = (path: string, taskIndex?: number) => ({
    onFocus: (event: React.FocusEvent<TextFieldElement>) => {
      if (typeof taskIndex === 'number') {
        setSelectedTaskIndex(taskIndex);
      }

      rememberTextField(path, event.currentTarget);
    },
    onSelect: (event: React.SyntheticEvent<TextFieldElement>) => {
      rememberTextField(path, event.currentTarget);
    },
    onClick: (event: React.MouseEvent<TextFieldElement>) => {
      rememberTextField(path, event.currentTarget);
    },
    onKeyUp: (event: React.KeyboardEvent<TextFieldElement>) => {
      rememberTextField(path, event.currentTarget);
    },
  });

  const updateField = (path: string, value: unknown) => {
    setGame((current) => writePathValue(current, path, value));
  };

  const handleNewGame = () => {
    setGame(createBlankGame());
    setSelectedTaskIndex(0);
    setLoadedFileName(null);
    activeTextFieldRef.current = null;
    toast({
      title: 'Ny editor-fil klar',
      description: 'Du starter nå med et blankt GameNight-spill.',
    });
  };

  const handleOpenJson = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const imported = parseImportedGame(await file.text());
      setGame(imported);
      setSelectedTaskIndex(0);
      setLoadedFileName(file.name);
      activeTextFieldRef.current = null;
      toast({
        title: 'JSON åpnet',
        description: `${file.name} er lastet inn lokalt i editoren.`,
      });
    } catch (error) {
      toast({
        title: 'Kunne ikke åpne filen',
        description:
          error instanceof Error
            ? error.message
            : 'Filen ser ikke ut som et gyldig GameNight-spill.',
        variant: 'destructive',
      });
    } finally {
      event.target.value = '';
    }
  };

  const handleDownloadJson = () => {
    if (!exportJson) {
      toast({
        title: 'Kan ikke lagre ennå',
        description: 'Rett opp feltene i valideringslisten først.',
        variant: 'destructive',
      });
      return;
    }

    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = downloadFileName;
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: 'JSON lagret',
      description: `${downloadFileName} er lastet ned til enheten din.`,
    });
  };

  const handleCopyJson = async () => {
    if (!exportJson) {
      toast({
        title: 'Kan ikke kopiere ennå',
        description: 'Rett opp feltene i valideringslisten først.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(exportJson);
      toast({
        title: 'JSON kopiert',
        description: 'Den formatterte spillfilen ligger nå på utklippstavlen.',
      });
    } catch {
      toast({
        title: 'Kunne ikke kopiere',
        description: 'Prøv heller å laste ned JSON-filen.',
        variant: 'destructive',
      });
    }
  };

  const handleInsertToken = (token: string) => {
    const activeField = activeTextFieldRef.current;

    if (!activeField) {
      toast({
        title: 'Velg et tekstfelt først',
        description: `Klikk i et tekstfelt før du setter inn ${token}.`,
      });
      return;
    }

    const currentValue = readPathValue(game, activeField.path);

    if (typeof currentValue !== 'string') {
      toast({
        title: 'Kan ikke sette inn her',
        description: 'Velg et vanlig tekstfelt eller tekstområde.',
        variant: 'destructive',
      });
      return;
    }

    const start = activeField.start;
    const end = activeField.end;
    const nextValue =
      currentValue.slice(0, start) + token + currentValue.slice(end);
    const nextCursor = start + token.length;

    setGame((current) => writePathValue(current, activeField.path, nextValue));

    requestAnimationFrame(() => {
      activeField.element?.focus();
      activeField.element?.setSelectionRange(nextCursor, nextCursor);
      activeTextFieldRef.current = {
        ...activeField,
        start: nextCursor,
        end: nextCursor,
      };
    });
  };

  const handleGenerateId = () => {
    const nextId = slugifyGameName(game.title);

    if (!nextId) {
      toast({
        title: 'Mangler tittel',
        description: 'Skriv en tittel først, så kan editoren lage en ID.',
      });
      return;
    }

    updateField('id', nextId);
    toast({
      title: 'ID oppdatert',
      description: `Spill-ID er satt til ${nextId}.`,
    });
  };

  const handleGameTypeChange = (value: string) => {
    setGame((current) => {
      const next = structuredClone(current);
      next.gameType = value as Game['gameType'];

      if (value === 'versus') {
        next.teams = next.teams ?? {
          team1: 'Lag A',
          team2: 'Lag B',
          team1Color: '',
          team2Color: '',
        };
      } else {
        delete next.teams;
      }

      if (value === 'spin-the-bottle') {
        next.spinMode = next.spinMode ?? 'choose';
      } else {
        delete next.spinMode;
      }

      return next;
    });
  };

  const handleWarningToggle = (checked: boolean) => {
    setGame((current) => {
      const next = structuredClone(current);
      next.warning = checked ? next.warning ?? createBlankWarning() : undefined;
      return next;
    });
  };

  const handleRuleToggle = (taskIndex: number, checked: boolean) => {
    setGame((current) => {
      const next = structuredClone(current);
      const task = next.items[taskIndex];

      if (!task) {
        return current;
      }

      task.rule = checked ? task.rule ?? createBlankRule() : undefined;
      return next;
    });
  };

  const insertTaskAfter = (taskIndex: number, type: GameTaskType = 'challenge') => {
    setGame((current) => {
      const next = structuredClone(current);
      next.items.splice(taskIndex + 1, 0, createBlankTask(type));
      return next;
    });
    setSelectedTaskIndex(taskIndex + 1);
  };

  const duplicateTask = (taskIndex: number) => {
    setGame((current) => {
      const next = structuredClone(current);
      const task = next.items[taskIndex];

      if (!task) {
        return current;
      }

      next.items.splice(taskIndex + 1, 0, structuredClone(task));
      return next;
    });
    setSelectedTaskIndex(taskIndex + 1);
  };

  const removeTask = (taskIndex: number) => {
    setGame((current) => {
      const next = structuredClone(current);
      next.items.splice(taskIndex, 1);
      return next;
    });
    setSelectedTaskIndex((current) => Math.max(0, Math.min(current, game.items.length - 2)));
  };

  const moveTask = (taskIndex: number, direction: -1 | 1) => {
    setGame((current) => {
      const next = structuredClone(current);
      const swapIndex = taskIndex + direction;

      if (swapIndex < 0 || swapIndex >= next.items.length) {
        return current;
      }

      const [task] = next.items.splice(taskIndex, 1);
      next.items.splice(swapIndex, 0, task);
      return next;
    });
    setSelectedTaskIndex(taskIndex + direction);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />

      <motion.header
        className="mx-auto mb-8 max-w-5xl text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={withBasePath('/GameNight-logo-small.webp')}
          alt="GameNight"
          width={340}
          height={96}
          priority
          className="mx-auto h-auto max-w-[270px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.28)] md:max-w-[340px]"
        />
        <Badge className="mt-5 border-primary/30 bg-primary/15 text-primary">
          Lokal editor
        </Badge>
        <h1 className="mt-4 text-balance text-4xl font-bold tracking-[-0.05em] text-foreground md:text-6xl">
          Game editor for lokale JSON-spill
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-base text-muted-foreground md:text-lg">
          Ingen backend, ingen database og ingen offisiell lenking. Her kan du
          åpne en GameNight-fil, bygge et nytt spill fra bunnen og eksportere en
          ren JSON-fil som kan sendes videre manuelt.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/85">
          <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1">
            Noindex
          </span>
          <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1">
            Ikke i sitemap
          </span>
          <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1">
            Kun lokal import/eksport
          </span>
        </div>
      </motion.header>

      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <Card className="overflow-hidden border-border/70 bg-card/85 backdrop-blur-sm">
            <CardHeader className="border-b border-border/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Wand2 className="h-5 w-5 text-primary" />
                Editorflyt
              </CardTitle>
              <CardDescription>
                Last inn en eksisterende fil fra GameNight, eller start helt
                blankt. Alt skjer i nettleseren din.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Button
                  type="button"
                  size="lg"
                  className="h-12 justify-start"
                  onClick={handleOpenJson}
                >
                  <FolderOpen className="h-5 w-5" />
                  Åpne JSON
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  className="h-12 justify-start"
                  onClick={handleNewGame}
                >
                  <Sparkles className="h-5 w-5" />
                  Nytt spill
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="h-12 justify-start"
                  onClick={handleDownloadJson}
                >
                  <Download className="h-5 w-5" />
                  Lagre JSON
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="h-12 justify-start"
                  onClick={handleCopyJson}
                >
                  <Copy className="h-5 w-5" />
                  Kopier JSON
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <StatPill
                  label="Kort"
                  value={`${game.items.length} stk`}
                />
                <StatPill
                  label="Spilltype"
                  value={
                    game.gameType === 'spin-the-bottle'
                      ? 'Spinn flasken'
                      : game.gameType === 'physical-item'
                        ? 'Fysisk objekt'
                        : game.gameType === 'versus'
                          ? 'Lagspill'
                          : 'Standard'
                  }
                />
                <StatPill
                  label="Shuffle"
                  value={game.shuffle ? 'På' : 'Av'}
                />
                <StatPill
                  label="Kilde"
                  value={loadedFileName ?? 'Ny lokal fil'}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/85 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Spillinfo</CardTitle>
              <CardDescription>
                Disse feltene blir toppnivået i JSON-filen og styrer hvordan
                spillet oppfører seg i GameNight.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <SectionLabel
                  htmlFor="game-title"
                  title="Tittel"
                  hint="Dette er navnet spillerne ser i GameNight."
                />
                <Input
                  id="game-title"
                  value={game.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  {...bindTextField('title')}
                />
              </div>

              <div>
                <SectionLabel
                  htmlFor="game-id"
                  title="Spill-ID"
                  hint="Bruk små bokstaver og bindestrek. Filnavnet bør matche."
                  action={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateId}
                    >
                      Lag fra tittel
                    </Button>
                  }
                />
                <Input
                  id="game-id"
                  value={game.id}
                  onChange={(event) => updateField('id', event.target.value)}
                  {...bindTextField('id')}
                />
              </div>

              <div>
                <SectionLabel
                  htmlFor="game-language"
                  title="Språk"
                  hint="I praksis er dette vanligvis `no`."
                />
                <Input
                  id="game-language"
                  value={game.language}
                  onChange={(event) => updateField('language', event.target.value)}
                  {...bindTextField('language')}
                />
              </div>

              <div className="md:col-span-2">
                <SectionLabel
                  htmlFor="game-description"
                  title="Beskrivelse"
                  hint="Kort nok til lobbyen, konkret nok til at noen forstår stemningen."
                />
                <Textarea
                  id="game-description"
                  value={game.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  {...bindTextField('description')}
                />
              </div>

              <div>
                <SectionLabel
                  htmlFor="game-emoji"
                  title="Emoji"
                  hint="Brukes i kort og lister."
                />
                <Input
                  id="game-emoji"
                  value={game.emoji ?? ''}
                  onChange={(event) => updateField('emoji', event.target.value)}
                  {...bindTextField('emoji')}
                />
              </div>

              <div>
                <SectionLabel
                  htmlFor="game-color"
                  title="Farge"
                  hint="Valgfritt. Bruk gjerne HSL som i eksisterende spill."
                />
                <Input
                  id="game-color"
                  value={game.color ?? ''}
                  onChange={(event) => updateField('color', event.target.value)}
                  {...bindTextField('color')}
                />
              </div>

              <div>
                <SectionLabel
                  htmlFor="game-categories"
                  title="Kategorier"
                  hint="Skriv med komma eller linjeskift. Eksempel: Party, Kaos"
                />
                <Input
                  id="game-categories"
                  value={game.category.join(', ')}
                  onChange={(event) =>
                    updateField('category', splitCsvInput(event.target.value))
                  }
                />
              </div>

              <div>
                <SectionLabel
                  htmlFor="game-tags"
                  title="Tags"
                  hint="Valgfritt. Brukes til ekstra filtrering."
                />
                <Input
                  id="game-tags"
                  value={(game.tags ?? []).join(', ')}
                  onChange={(event) =>
                    updateField('tags', splitCsvInput(event.target.value))
                  }
                />
              </div>

              <div>
                <SectionLabel title="Intensitet" />
                <Select
                  value={game.intensity}
                  onValueChange={(value) =>
                    updateField('intensity', value as Game['intensity'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_INTENSITIES.map((intensity) => (
                      <SelectItem key={intensity} value={intensity}>
                        {intensityStyles[intensity].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <SectionLabel title="Publikum" />
                <Select
                  value={game.audience}
                  onValueChange={(value) =>
                    updateField('audience', value as Game['audience'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_AUDIENCES.map((audience) => (
                      <SelectItem key={audience} value={audience}>
                        {audience === '18+' ? '18+' : 'Alle'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/85 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Flyt og synlighet</CardTitle>
              <CardDescription>
                Styr hvor spillet passer inn og hvilke spesialfelter editoren
                skal vise.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <SectionLabel title="Spilltype" />
                <Select
                  value={game.gameType ?? 'default'}
                  onValueChange={handleGameTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_TYPES.map((gameType) => (
                      <SelectItem key={gameType} value={gameType}>
                        {gameType === 'default'
                          ? 'Standard'
                          : gameType === 'versus'
                            ? 'Lagspill'
                            : gameType === 'spin-the-bottle'
                              ? 'Spinn flasken'
                              : 'Fysisk objekt'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {game.gameType === 'spin-the-bottle' && (
                <div>
                  <SectionLabel title="Spin mode" />
                  <Select
                    value={game.spinMode ?? 'choose'}
                    onValueChange={(value) =>
                      updateField('spinMode', value as Game['spinMode'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPIN_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode === 'choose'
                            ? 'La spilleren velge'
                            : mode === 'virtual'
                              ? 'Virtuell'
                              : 'Fysisk'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {game.gameType === 'versus' && (
                <>
                  <div>
                    <SectionLabel
                      htmlFor="team-1"
                      title="Lag 1"
                      hint="Lagene blir brukt i `{team1}` og `{team2}`."
                    />
                    <Input
                      id="team-1"
                      value={game.teams?.team1 ?? ''}
                      onChange={(event) =>
                        updateField('teams.team1', event.target.value)
                      }
                      {...bindTextField('teams.team1')}
                    />
                  </div>
                  <div>
                    <SectionLabel htmlFor="team-2" title="Lag 2" />
                    <Input
                      id="team-2"
                      value={game.teams?.team2 ?? ''}
                      onChange={(event) =>
                        updateField('teams.team2', event.target.value)
                      }
                      {...bindTextField('teams.team2')}
                    />
                  </div>
                  <div>
                    <SectionLabel
                      htmlFor="team-1-color"
                      title="Lag 1-farge"
                      hint="Valgfritt HSL-felt."
                    />
                    <Input
                      id="team-1-color"
                      value={game.teams?.team1Color ?? ''}
                      onChange={(event) =>
                        updateField('teams.team1Color', event.target.value)
                      }
                      {...bindTextField('teams.team1Color')}
                    />
                  </div>
                  <div>
                    <SectionLabel htmlFor="team-2-color" title="Lag 2-farge" />
                    <Input
                      id="team-2-color"
                      value={game.teams?.team2Color ?? ''}
                      onChange={(event) =>
                        updateField('teams.team2Color', event.target.value)
                      }
                      {...bindTextField('teams.team2Color')}
                    />
                  </div>
                </>
              )}

              <div className="space-y-3 rounded-2xl border border-border/70 bg-background/50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="shuffle">Shuffle kortene</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Slå av hvis rekkefølgen i JSON skal beholdes.
                    </p>
                  </div>
                  <Switch
                    id="shuffle"
                    checked={Boolean(game.shuffle)}
                    onCheckedChange={(checked) => updateField('shuffle', checked)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="requires-players">Krever spillere</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Brukes når spillet trenger navn eller spilleroppsett.
                    </p>
                  </div>
                  <Switch
                    id="requires-players"
                    checked={Boolean(game.requiresPlayers)}
                    onCheckedChange={(checked) =>
                      updateField('requiresPlayers', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="hidden">Skjult spill</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Settes for spill som ikke skal vises offentlig.
                    </p>
                  </div>
                  <Switch
                    id="hidden"
                    checked={Boolean(game.hidden)}
                    onCheckedChange={(checked) => updateField('hidden', checked)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="hidden-main">Skjul fra hovedlisten</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Beholder spillet tilgjengelig, men ute av hovedlobbyen.
                    </p>
                  </div>
                  <Switch
                    id="hidden-main"
                    checked={Boolean(game.isHiddenFromMain)}
                    onCheckedChange={(checked) =>
                      updateField('isHiddenFromMain', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="custom">Merk som custom</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Praktisk for interne eller spesielle oppsett.
                    </p>
                  </div>
                  <Switch
                    id="custom"
                    checked={Boolean(game.custom)}
                    onCheckedChange={(checked) => updateField('custom', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <SectionLabel
                    htmlFor="min-players"
                    title="Minimum spillere"
                    hint="La feltet stå tomt hvis standardreglene skal gjelde."
                  />
                  <Input
                    id="min-players"
                    type="number"
                    min={1}
                    value={game.minPlayers ?? ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateField(
                        'minPlayers',
                        value === '' ? undefined : Number(value)
                      );
                    }}
                  />
                </div>
                <div>
                  <SectionLabel
                    htmlFor="region"
                    title="Region"
                    hint="Valgfritt for lokale/russe-relaterte spill."
                  />
                  <Input
                    id="region"
                    value={game.region ?? ''}
                    onChange={(event) => updateField('region', event.target.value)}
                    {...bindTextField('region')}
                  />
                </div>
                <div>
                  <SectionLabel htmlFor="kommune" title="Kommune" />
                  <Input
                    id="kommune"
                    value={game.kommune ?? ''}
                    onChange={(event) => updateField('kommune', event.target.value)}
                    {...bindTextField('kommune')}
                  />
                </div>
                <div>
                  <SectionLabel htmlFor="instagram" title="Instagram" />
                  <Input
                    id="instagram"
                    value={game.instagram ?? ''}
                    onChange={(event) =>
                      updateField('instagram', event.target.value)
                    }
                    {...bindTextField('instagram')}
                  />
                </div>
                <div>
                  <SectionLabel htmlFor="logo" title="Logo-URL eller navn" />
                  <Input
                    id="logo"
                    value={game.logo ?? ''}
                    onChange={(event) => updateField('logo', event.target.value)}
                    {...bindTextField('logo')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/85 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Advarsel og samtykke</CardTitle>
              <CardDescription>
                Brukes når spillet trenger ekstra tydelig samtykke eller
                innholdsvarsel før start.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 p-4">
                <div>
                  <Label htmlFor="warning-enabled">Aktiver warning</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Slå på hvis spillet trenger egen advarselsflate.
                  </p>
                </div>
                <Switch
                  id="warning-enabled"
                  checked={Boolean(game.warning)}
                  onCheckedChange={handleWarningToggle}
                />
              </div>

              {game.warning && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <SectionLabel htmlFor="warning-title" title="Warning-tittel" />
                    <Input
                      id="warning-title"
                      value={game.warning.title}
                      onChange={(event) =>
                        updateField('warning.title', event.target.value)
                      }
                      {...bindTextField('warning.title')}
                    />
                  </div>
                  <div>
                    <SectionLabel
                      htmlFor="warning-button"
                      title="Knappetekst"
                    />
                    <Input
                      id="warning-button"
                      value={game.warning.buttonText}
                      onChange={(event) =>
                        updateField('warning.buttonText', event.target.value)
                      }
                      {...bindTextField('warning.buttonText')}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <SectionLabel
                      htmlFor="warning-description"
                      title="Warning-linjer"
                      hint="Én linje per punkt i JSON-filen."
                    />
                    <Textarea
                      id="warning-description"
                      value={game.warning.description.join('\n')}
                      onChange={(event) =>
                        updateField(
                          'warning.description',
                          splitLines(event.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[2rem] border border-border/70 bg-card/85 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                  Kortstokk
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Kortene under er selve `items`-listen. Bruk pluss og minus for
                  å bygge runden manuelt.
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                className="h-12"
                onClick={() => insertTaskAfter(game.items.length - 1)}
              >
                <CirclePlus className="h-5 w-5" />
                Legg til kort
              </Button>
            </div>

            {game.items.length === 0 && (
              <Card className="border-dashed border-border/70 bg-card/80 text-center">
                <CardContent className="p-10">
                  <p className="text-lg font-semibold text-foreground">
                    Ingen kort ennå
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start med å legge til første kort i spillet.
                  </p>
                  <Button
                    type="button"
                    className="mt-5"
                    onClick={() => insertTaskAfter(-1)}
                  >
                    <CirclePlus className="h-4 w-4" />
                    Legg til første kort
                  </Button>
                </CardContent>
              </Card>
            )}

            {game.items.map((task, index) => {
              const isSelected = selectedTaskIndex === index;

              return (
                <motion.div
                  key={`${index}-${task.type}-${task.text.slice(0, 12)}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Card
                    className={cn(
                      'border-border/70 bg-card/88 backdrop-blur-sm transition-all duration-200',
                      isSelected 
                        ? 'border-primary/50 shadow-[0_20px_50px_rgba(0,0,0,0.18)] shadow-primary/10'
                        : 'cursor-pointer hover:border-primary/30 hover:bg-card/95'
                    )}
                    onClick={() => {
                      if (!isSelected) setSelectedTaskIndex(index);
                    }}
                  >
                    <CardHeader
                      className={cn(
                        'gap-4 border-border/60 md:flex-row md:items-start md:justify-between',
                        isSelected ? 'border-b' : 'py-4'
                      )}
                    >
                      <div className={cn(!isSelected && 'flex-1 overflow-hidden')}>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={isSelected ? "secondary" : "outline"}>Kort {index + 1}</Badge>
                          <Badge className="border-primary/20 bg-primary/15 text-primary">
                            {GAME_TASK_TYPE_LABELS[task.type]}
                          </Badge>
                          {task.moment && (
                            <Badge variant="outline">
                              {GAME_TASK_MOMENT_LABELS[task.moment]}
                            </Badge>
                          )}
                          {task.rule && <Badge variant="outline">Regel</Badge>}
                        </div>
                        
                        {isSelected ? (
                          <>
                            <CardTitle className="mt-3 text-2xl">
                              {task.text.trim()
                                ? task.text.slice(0, 72)
                                : 'Nytt kort'}
                            </CardTitle>
                            <CardDescription className="mt-2 max-w-3xl">
                              {taskTypeDescriptions[task.type]}
                            </CardDescription>
                          </>
                        ) : (
                          <div className="mt-2 truncate text-base font-medium text-foreground">
                            {task.text.trim() ? task.text : <span className="italic text-muted-foreground">Tomt kort...</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveTask(index, -1);
                          }}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveTask(index, 1);
                          }}
                          disabled={index === game.items.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            duplicateTask(index);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            insertTaskAfter(index, task.type);
                          }}
                        >
                          <CirclePlus className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeTask(index);
                          }}
                        >
                          <CircleMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {isSelected && (
                      <CardContent className="space-y-5 p-6">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <SectionLabel title="Korttype" />
                          <Select
                            value={task.type}
                            onValueChange={(value) =>
                              updateField(
                                `items.${index}.type`,
                                value as GameTaskType
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GAME_TASK_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {GAME_TASK_TYPE_LABELS[type]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <SectionLabel
                            title="Moment"
                            hint="Valgfritt ekstra signal til gameplay og tone."
                          />
                          <Select
                            value={task.moment ?? '__none__'}
                            onValueChange={(value) =>
                              updateField(
                                `items.${index}.moment`,
                                value === '__none__'
                                  ? undefined
                                  : (value as GameTask['moment'])
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__none__">Ingen</SelectItem>
                              {GAME_TASK_MOMENTS.map((moment) => (
                                <SelectItem key={moment} value={moment}>
                                  {GAME_TASK_MOMENT_LABELS[moment]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <SectionLabel
                          htmlFor={`task-text-${index}`}
                          title="Korttekst"
                          hint="Her er det vanlig å bruke {player}, {player2}, {all}, {team1} og {team2}."
                          action={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleInsertToken('{player}')}
                            >
                              Sett inn {'{player}'}
                            </Button>
                          }
                        />
                        <Textarea
                          id={`task-text-${index}`}
                          value={task.text}
                          onChange={(event) =>
                            updateField(`items.${index}.text`, event.target.value)
                          }
                          {...bindTextField(`items.${index}.text`, index)}
                        />
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <Label htmlFor={`task-rule-${index}`}>
                              Har dette kortet en vedvarende regel?
                            </Label>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Slå på hvis kortet skal skrive til `rule` i JSON.
                            </p>
                          </div>
                          <Switch
                            id={`task-rule-${index}`}
                            checked={Boolean(task.rule)}
                            onCheckedChange={(checked) =>
                              handleRuleToggle(index, checked)
                            }
                          />
                        </div>

                        {task.rule && (
                          <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <div>
                              <SectionLabel title="Rule action" />
                              <Select
                                value={task.rule.action}
                                onValueChange={(value) =>
                                  updateField(
                                    `items.${index}.rule.action`,
                                    value as GameRule['action']
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="activate">activate</SelectItem>
                                  <SelectItem value="clear">clear</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <SectionLabel
                                htmlFor={`task-rule-duration-${index}`}
                                title="Varighet i runder"
                                hint="Valgfritt for activate-regler."
                              />
                              <Input
                                id={`task-rule-duration-${index}`}
                                type="number"
                                min={1}
                                value={task.rule.duration ?? ''}
                                onChange={(event) =>
                                  updateField(
                                    `items.${index}.rule.duration`,
                                    event.target.value === ''
                                      ? undefined
                                      : Number(event.target.value)
                                  )
                                }
                              />
                            </div>
                            <div>
                              <SectionLabel
                                htmlFor={`task-rule-title-${index}`}
                                title="Rule-tittel"
                              />
                              <Input
                                id={`task-rule-title-${index}`}
                                value={task.rule.title}
                                onChange={(event) =>
                                  updateField(
                                    `items.${index}.rule.title`,
                                    event.target.value
                                  )
                                }
                                {...bindTextField(`items.${index}.rule.title`, index)}
                              />
                            </div>
                            <div>
                              <SectionLabel
                                htmlFor={`task-rule-category-${index}`}
                                title="Rule-kategori"
                                hint="Praktisk når en ny regel skal erstatte en gammel kategori."
                              />
                              <Input
                                id={`task-rule-category-${index}`}
                                value={task.rule.category ?? ''}
                                onChange={(event) =>
                                  updateField(
                                    `items.${index}.rule.category`,
                                    event.target.value
                                  )
                                }
                                {...bindTextField(
                                  `items.${index}.rule.category`,
                                  index
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <SectionLabel
                                htmlFor={`task-rule-description-${index}`}
                                title="Rule-beskrivelse"
                              />
                              <Textarea
                                id={`task-rule-description-${index}`}
                                value={task.rule.description}
                                onChange={(event) =>
                                  updateField(
                                    `items.${index}.rule.description`,
                                    event.target.value
                                  )
                                }
                                {...bindTextField(
                                  `items.${index}.rule.description`,
                                  index
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <SectionLabel
                                htmlFor={`task-rule-replaces-${index}`}
                                title="Erstatter kategorier"
                                hint="Valgfritt. Skriv med komma eller linjeskift."
                              />
                              <Input
                                id={`task-rule-replaces-${index}`}
                                value={(task.rule.replacesCategories ?? []).join(', ')}
                                onChange={(event) =>
                                  updateField(
                                    `items.${index}.rule.replacesCategories`,
                                    splitCsvInput(event.target.value)
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </section>
        </motion.div>

        <motion.aside
          className="space-y-6 xl:sticky xl:top-6 xl:self-start"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          <Card className="border-border/70 bg-card/88 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Variabler</CardTitle>
              <CardDescription>
                Klikk i et tekstfelt og sett inn plassholdere uten å skrive dem
                manuelt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {PLACEHOLDER_TOKENS.map((placeholder) => (
                  <Button
                    key={placeholder.token}
                    type="button"
                    variant={
                      placeholder.token === '{player}' ? 'default' : 'outline'
                    }
                    className="justify-start"
                    onClick={() => handleInsertToken(placeholder.token)}
                  >
                    <Sparkles className="h-4 w-4" />
                    {placeholder.label}
                  </Button>
                ))}
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
                Siste fokuserte tekstfelt får variabelen på markørposisjonen. Det
                gjør det raskt å bygge kort som bruker spiller-, gruppe- eller
                lagplassholdere.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/88 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Forhåndsvisning</CardTitle>
              <CardDescription>
                Vis valgt kort i GameNight-stil eller se den eksakte JSON-en som
                er klar for eksport.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Kort
                  </TabsTrigger>
                  <TabsTrigger value="json" className="gap-2">
                    <Braces className="h-4 w-4" />
                    JSON
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="space-y-4">
                  <TaskCard
                    game={{ id: game.id || 'preview', category: game.category }}
                    task={previewTask}
                    rule={previewTask.rule}
                    teams={game.teams}
                    content={previewTask.text || 'Skriv tekst i kortet du vil teste'}
                  />
                  <p className="text-xs text-muted-foreground">
                    Previewen bruker eksempelverdier for plassholdere, så{' '}
                    <code>{'{player}'}</code> blir vist som «Spiller 1».
                  </p>
                </TabsContent>
                <TabsContent value="json">
                  <div className="rounded-[1.5rem] border border-border/70 bg-black/30 p-4">
                    <pre className="max-h-[30rem] overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-foreground/90">
                      {exportJson ??
                        'JSON blir tilgjengelig her så snart valideringen er grønn.'}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'border-border/70 bg-card/88 backdrop-blur-sm',
              issueList.length > 0 && 'border-destructive/50'
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <FileJson className="h-5 w-5 text-primary" />
                Validering
              </CardTitle>
              <CardDescription>
                Editoren sjekker at JSON-filen er spillbar og passer modellen i
                GameNight.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issueList.length === 0 ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                  JSON-en er gyldig og klar for lokal lagring.
                </div>
              ) : (
                <div className="space-y-3">
                  {issueList.map((issue, index) => (
                    <div
                      key={`${issue.path}-${index}`}
                      className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {issue.path || 'Spillfil'}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {issue.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.aside>
      </div>
    </div>
  );
}
