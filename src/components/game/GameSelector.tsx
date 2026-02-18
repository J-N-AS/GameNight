'use client';

import type { Game } from '@/lib/games';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, PartyPopper } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type GameSelectorProps = {
  games: Omit<Game, 'items' | 'language' | 'shuffle'>[];
};

export function GameSelector({ games }: GameSelectorProps) {
  // For now, all games are "featured"
  const featuredGames = games;

  return (
    <>
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">Anbefalte spill</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {featuredGames.map((game) => (
              <CarouselItem key={game.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Link href={`/spill/${game.id}`} className="group">
                    <Card className="h-full flex flex-col transition-all duration-300 group-hover:border-primary group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                          <PartyPopper className="w-5 h-5 text-primary" />
                          {game.title}
                        </CardTitle>
                        <CardDescription className="text-sm">{game.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto bg-muted/20 px-6 py-3">
                        <div className="text-sm font-semibold text-primary w-full flex justify-between items-center">
                          Start spillet
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">Har du en kode?</h2>
        <form className="max-w-sm mx-auto flex gap-2">
          <Input
            type="text"
            placeholder="Skriv inn kode..."
            className="text-center tracking-widest uppercase"
          />
          <Button type="submit" variant="default">
            Bli med
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          For russegrupper og egne spill.
        </p>
      </section>
    </>
  );
}
