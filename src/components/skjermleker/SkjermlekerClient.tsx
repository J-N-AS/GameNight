'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { ScreenGameCategory } from '@/lib/types';
import { AdBanner } from '../ads/AdBanner';

export function SkjermlekerClient({ categories }: { categories: ScreenGameCategory[] }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>
        </Button>
      </div>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter flex items-center justify-center gap-3">
          <Clapperboard className="h-10 w-10" />
          Skjermleker
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          Gjør filmkvelden, TV-tittingen eller fotballkampen enda mer engasjerende med våre partyspill for skjerm. Enkle regler, garantert god stemning.
        </p>
      </header>

      <div className="space-y-16">
        {categories.map((category) => (
          <motion.section 
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight mb-6 text-center">{category.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        {game.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground/80">
                        {game.artist}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">{game.rules}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <AdBanner />
      </motion.div>
    </div>
  );
}
