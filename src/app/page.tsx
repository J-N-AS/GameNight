import { getGames } from '@/lib/games';
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

export default async function Home() {
  const games = await getGames();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          GameNight
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Gratis partyspill, rett i nettleseren.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">Velg et spill</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link href={`/spill/${game.id}`} key={game.id} className="group">
              <Card className="h-full flex flex-col transition-all duration-300 group-hover:border-primary group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <PartyPopper className="w-6 h-6 text-primary" />
                    {game.title}
                  </CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button variant="ghost" className="w-full justify-between">
                    Start spillet
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
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
    </div>
  );
}
