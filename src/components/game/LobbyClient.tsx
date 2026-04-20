'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Beer,
  ChevronRight,
  Clapperboard,
  Dices,
  Gamepad2,
  Music,
  Rocket,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlayerSetup } from './PlayerSetup';
import { GameMenu } from './GameMenu';
import { GameStartDialog } from './GameStartDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSession } from '@/hooks/usePlayers';
import { withBasePath } from '@/lib/base-path';
import {
  formatPlayerCount,
  getMinimumPlayers,
  getMissingPlayers,
  getPlayerRequirementLabel,
  hasEnoughPlayers,
} from '@/lib/player-requirements';
import { useGameStart } from '@/hooks/useGameStart';
import { intensityStyles } from '@/lib/game-ui';
import { cn } from '@/lib/utils';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

const FUTURE_ROWS = [
  {
    title: 'Klassiske drikkeleker',
    description:
      'Finn tidløse drikkeleker med tydelige regler, forslag til oppsett og raske varianter som fungerer fra første runde.',
    icon: Beer,
    href: '/drikkeleker',
  },
  {
    title: 'Musikk drikkeleker',
    description:
      'Start musikkrunder med ferdige kategorier, enkle drikkeregler og tips som holder energien oppe gjennom hele kvelden.',
    icon: Music,
    href: '/musikkleker',
  },
  {
    title: 'Skjerm drikkeleker',
    description:
      'Kjør skjermbaserte leker inspirert av TV, sport og reality med opplegg som gjør det lett å spille sammen i stua.',
    icon: Clapperboard,
    href: '/skjermleker',
  },
] as const;

function GameCard({
  game,
  onStart,
}: {
  game: GameFromGetGames;
  onStart: (game: GameFromGetGames, event?: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={`/spill/${game.id}`}
      onClick={(event) => onStart(game, event)}
      className="group block h-full"
    >
      <Card className="flex h-full flex-col border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
        <CardHeader className="flex-row items-start gap-4 pb-4">
          <div className="mt-1 text-4xl">{game.emoji}</div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl font-bold transition-colors group-hover:text-primary">
                {game.title}
              </CardTitle>
              {game.audience === '18+' && (
                <span className="rounded-full bg-destructive/80 px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                  18+
                </span>
              )}
            </div>
            <CardDescription className="mt-1 text-muted-foreground/80">
              {game.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-auto flex items-end justify-between gap-4 pt-0">
          <div className="min-w-0">
            {getPlayerRequirementLabel(game) && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-foreground/80">
                {getPlayerRequirementLabel(game)}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                intensityStyles[game.intensity].dotClass
              )}
            />
            {intensityStyles[game.intensity].label}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function LobbyClient({
  allGames,
  recommendedGames,
}: {
  allGames: GameFromGetGames[];
  recommendedGames: GameFromGetGames[];
}) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState(false);
  const [surpriseGame, setSurpriseGame] = useState<GameFromGetGames | null>(null);
  const [pendingReturnPath, setPendingReturnPath] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Alle');

  const { players, isLoaded } = useSession();
  const router = useRouter();
  const { startGame, gameStartDialogProps } = useGameStart();

  const visibleGames = useMemo(
    () => allGames.filter((game) => !game.hidden && !game.isHiddenFromMain),
    [allGames]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    visibleGames.forEach((game) => {
      (game.category ?? []).forEach((category) => {
        counts.set(category, (counts.get(category) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'nb')
    );
  }, [visibleGames]);

  const categoryOptions = useMemo(
    () => [
      { label: 'Alle', count: visibleGames.length },
      ...categoryCounts.map(([label, count]) => ({ label, count })),
    ],
    [categoryCounts, visibleGames.length]
  );

  const pendingGame = useMemo(() => {
    if (!pendingReturnPath) {
      return null;
    }

    return allGames.find((game) => pendingReturnPath === `/spill/${game.id}`) ?? null;
  }, [allGames, pendingReturnPath]);

  const pendingGameRequirement = pendingGame ? getMinimumPlayers(pendingGame) : 0;
  const missingPendingPlayers = pendingGame
    ? getMissingPlayers(pendingGame, players.length)
    : 0;

  const filteredCategoryGames = useMemo(() => {
    const matchesCategory =
      activeCategory === 'Alle'
        ? visibleGames
        : visibleGames.filter((game) => game.category?.includes(activeCategory));

    return matchesCategory.slice(0, 6);
  }, [activeCategory, visibleGames]);

  const allGamesHref =
    activeCategory === 'Alle'
      ? '/alle-spill'
      : `/alle-spill?kategori=${encodeURIComponent(activeCategory)}`;

  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);

    if (
      pendingReturnPath &&
      pendingGame &&
      hasEnoughPlayers(pendingGame, players.length)
    ) {
      router.push(pendingReturnPath);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const shouldOpenSetup = params.get('setupPlayers') === '1';
    const returnTo = params.get('returnTo');

    if (shouldOpenSetup) {
      setIsPlayerSetupOpen(true);
    }

    if (returnTo && returnTo.startsWith('/spill/') && !returnTo.includes('://')) {
      setPendingReturnPath(returnTo);
      return;
    }

    setPendingReturnPath(null);
  }, []);

  useEffect(() => {
    if (categoryOptions.some((option) => option.label === activeCategory)) {
      return;
    }

    setActiveCategory('Alle');
  }, [activeCategory, categoryOptions]);

  const selectRandomGame = () => {
    if (visibleGames.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * visibleGames.length);
    setSurpriseGame(visibleGames[randomIndex]);
  };

  const handleSurpriseMeClick = () => {
    selectRandomGame();
    setIsSurpriseMeOpen(true);
  };

  const handleTryAnother = () => {
    selectRandomGame();
  };

  const handleStartSurpriseGame = () => {
    if (!surpriseGame) {
      return;
    }

    setIsSurpriseMeOpen(false);
    startGame(surpriseGame);
  };

  const playerDescription = (() => {
    if (!isLoaded) {
      return 'Laster spillerlisten deres.';
    }

    if (players.length === 0) {
      if (pendingGame) {
        if (pendingGameRequirement > 0) {
          return `${pendingGame.title} trenger minst ${formatPlayerCount(
            pendingGameRequirement
          )}. Legg inn navnene først.`;
        }

        return `${pendingGame.title} kan startes med en gang, men navn gjør opplevelsen bedre.`;
      }

      return 'Legg inn navnene først, så går det raskere å starte riktig spill.';
    }

    if (pendingGame && missingPendingPlayers > 0) {
      return `${players.length} klare nå. ${formatPlayerCount(
        missingPendingPlayers
      )} mangler for å starte ${pendingGame.title}.`;
    }

    if (pendingGame) {
      return `${players.length} klare for ${pendingGame.title}. Du kan fortsatt justere navn før start.`;
    }

    return `${players.length} spillere er klare for neste runde.`;
  })();

  return (
    <motion.div
      className="container mx-auto px-4 py-6 md:py-10"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
    >
      <motion.header
        className="mx-auto mb-6 max-w-xl text-center md:mb-8"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <h1 className="sr-only">
          GameNight - Gratis drikkespill, festspill og isbrytere på én mobil
        </h1>
        <Image
          src={withBasePath('/GameNight-logo-small.webp')}
          alt="GameNight Logo"
          width={400}
          height={100}
          priority
          className="mx-auto h-auto max-w-[280px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)] md:max-w-[360px]"
        />
        <p className="mt-4 text-lg font-semibold text-foreground md:text-xl">
          Start et partyspill på sekunder.
        </p>
      </motion.header>

      <motion.section
        className="mx-auto mb-14 max-w-xl md:mb-16"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <Card className="border-border/70 bg-card/85 shadow-xl shadow-black/10 backdrop-blur-sm">
          <CardHeader className="gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-5 w-5" />
                  Hvem spiller?
                </CardTitle>
                <CardDescription className="max-w-md text-sm text-muted-foreground/90">
                  {playerDescription}
                </CardDescription>
              </div>
              <GameMenu context="lobby" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {pendingGame && (
              <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground/90">
                {missingPendingPlayers > 0 ? (
                  <p>
                    <span className="font-semibold">{pendingGame.title}</span> starter
                    når minst {formatPlayerCount(pendingGameRequirement)} er lagt til.
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">{pendingGame.title}</span> er klar
                    til start.
                  </p>
                )}
              </div>
            )}

            {isLoaded && players.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {players.map((player) => (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                  >
                    {player.name}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/30 px-4 py-5 text-sm text-muted-foreground">
                Legg til navnene nå, så er dere klare når dere finner spillet som
                passer.
              </div>
            )}
          </CardContent>

          <CardFooter
            className={cn(
              'grid gap-2',
              players.length > 0
                ? pendingReturnPath
                  ? 'grid-cols-1 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1'
            )}
          >
            <PlayerSetup
              open={isPlayerSetupOpen}
              onOpenChange={setIsPlayerSetupOpen}
              onSetupComplete={handleSetupComplete}
              requiredPlayers={pendingGameRequirement}
              pendingGameTitle={pendingGame?.title}
            >
              <Button
                className="w-full"
                variant={players.length > 0 ? 'outline' : 'default'}
                disabled={!isLoaded}
              >
                {players.length > 0
                  ? pendingGame && missingPendingPlayers > 0
                    ? 'Legg til flere spillere'
                    : 'Endre spillere'
                  : pendingGame && pendingGameRequirement > 0
                    ? `Legg til ${formatPlayerCount(pendingGameRequirement)}`
                    : 'Legg til spillere'}
              </Button>
            </PlayerSetup>

            {players.length > 0 && (
              <Button asChild variant="secondary">
                <Link href="/oppsummering">
                  <Trophy className="mr-2 h-5 w-5" />
                  Oppsummering
                </Link>
              </Button>
            )}

            {pendingReturnPath && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  if (pendingGame) {
                    startGame(pendingGame);
                    return;
                  }

                  router.push(pendingReturnPath);
                }}
              >
                <Rocket className="mr-2 h-5 w-5" />
                {pendingGame && missingPendingPlayers > 0
                  ? 'Fortsett i spilleroppsett'
                  : 'Tilbake til spillet'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.section>

      <motion.section
        className="mb-16 md:mb-20"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <div className="mx-auto mb-6 flex max-w-5xl flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-bold font-headline">Anbefalt nå</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Raske favoritter som fungerer godt når dere vil i gang med én gang.
            </p>
          </div>
          <Button variant="secondary" onClick={handleSurpriseMeClick}>
            <Dices className="mr-2 h-5 w-5" />
            Overrask meg
          </Button>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {recommendedGames.map((game) => (
            <GameCard key={game.id} game={game} onStart={startGame} />
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mb-8"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-bold font-headline">Kategorier</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Filtrer direkte på spilldekkene og hopp videre til det som passer kvelden.
            </p>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center">
            {categoryOptions.map((option) => (
              <Button
                key={option.label}
                variant={activeCategory === option.label ? 'default' : 'outline'}
                onClick={() => setActiveCategory(option.label)}
                className="shrink-0"
              >
                {option.label}
                <span className="ml-2 text-xs opacity-75">{option.count}</span>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategoryGames.map((game) => (
              <GameCard key={`${activeCategory}-${game.id}`} game={game} onStart={startGame} />
            ))}
          </div>

          {filteredCategoryGames.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border/70 bg-card/50 px-6 py-10 text-center text-sm text-muted-foreground">
              Ingen spill matcher denne kategorien akkurat nå.
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="min-w-48">
              <Link href={allGamesHref}>
                <Gamepad2 className="mr-2 h-5 w-5" />
                Se alle spill
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-5xl space-y-4"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        {FUTURE_ROWS.map((row) => {
          const Icon = row.icon;

          return (
            <Link key={row.title} href={row.href} className="group block">
              <Card className="border-border/70 bg-card/65 backdrop-blur-sm transition-colors duration-200 hover:bg-white/5">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                        {row.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{row.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </motion.section>


      <motion.section
        className="mx-auto mt-12 max-w-5xl"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <Card className="border-border/70 bg-card/55 backdrop-blur-sm">
          <CardContent className="space-y-5 p-5 text-sm leading-6 text-muted-foreground md:p-7">
            <div>
              <h2 className="text-base font-semibold text-foreground">Hva er GameNight</h2>
              <p className="mt-2">
                GameNight er et norsk spillbibliotek for festspill, isbrytere og drikkeleker som er laget for å
                fungere raskt på mobil. Målet er at dere skal komme i gang på sekunder, uten lange regler eller
                tungt oppsett. Hvert spillkort er skrevet med tydelig språk, kort varighet og praktiske forslag
                til gruppestørrelse, slik at det blir enklere å velge riktig stemning i rommet. Vi bygger
                innholdet for ekte kvelder med venner, men med fokus på trygg ramme, tydelige valg og respekt for
                at alle deltakere er forskjellige.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">Hvordan vi kvalitetssikrer innhold</h3>
              <p className="mt-2">
                Spill og regler gjennomgås redaksjonelt før publisering, og vi oppdaterer løpende når språk,
                flyt eller sikkerhet kan bli bedre. Vi prioriterer klare instruksjoner, realistiske tidsrammer og
                balanse mellom humor og inkludering, slik at innholdet fungerer både for nye og erfarne spillere.
                Les mer om prinsipper, kriterier og oppdateringsrutiner i
                {' '}
                <Link href="/info/redaksjonell-policy" className="font-medium text-foreground underline underline-offset-4">
                  redaksjonell policy
                </Link>
                , samt hvordan vi håndterer data i
                {' '}
                <Link href="/info/personvern" className="font-medium text-foreground underline underline-offset-4">
                  personvern
                </Link>
                {' '}og våre
                {' '}
                <Link href="/vilkar" className="font-medium text-foreground underline underline-offset-4">
                  vilkår
                </Link>
                .
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">Ansvarlig bruk 18+</h3>
              <p className="mt-2">
                Innhold merket 18+ er laget for voksne brukere og skal brukes med samtykke, pauser og respekt for
                egne grenser. Ingen skal presses til å drikke, utføre utfordringer eller bli med på regler som
                føles utrygge. Vi anbefaler vann tilgjengelig, tydelig stoppord og at vertskapet justerer tempo
                etter gruppen.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">Slik bruker du siden uten alkohol</h3>
              <p className="mt-2">
                Alle konsepter kan spilles alkoholfritt: bytt drikk med vann, brus, poeng, oppgaver eller små
                premier. Dere kan også velge spill som handler om kreativitet, samarbeid eller latter uten
                drikkepress. Hvis du vil utforske flere varianter, finner du oversikten i
                {' '}
                <Link href="/drikkeleker" className="font-medium text-foreground underline underline-offset-4">
                  drikkeleker
                </Link>
                {' '}og kan tilpasse reglene til gruppen deres.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <Dialog open={isSurpriseMeOpen} onOpenChange={setIsSurpriseMeOpen}>
        <DialogContent>
          <DialogHeader>
            {surpriseGame && (
              <>
                <DialogTitle className="flex items-center gap-4 text-2xl">
                  <span className="text-5xl">{surpriseGame.emoji}</span>
                  {surpriseGame.title}
                </DialogTitle>
                <DialogDescription className="pt-2 text-base">
                  {surpriseGame.description}
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-between">
            <Button variant="secondary" onClick={handleTryAnother}>
              Prøv et annet
            </Button>
            <Button onClick={handleStartSurpriseGame} disabled={!surpriseGame}>
              Kjør i gang!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GameStartDialog {...gameStartDialogProps} />
    </motion.div>
  );
}
