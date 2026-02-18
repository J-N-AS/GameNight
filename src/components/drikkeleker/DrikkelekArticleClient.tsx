'use client';

import type { GameArticle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dice5, Crown, HelpCircle, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function DrikkelekArticleClient({ article }: { article: GameArticle }) {
  return (
    <motion.div
      className="container mx-auto px-4 py-8 md:py-16 max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/drikkeleker">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til alle drikkeleker
          </Link>
        </Button>
      </div>
      <Card className="bg-card/80 backdrop-blur-sm">
        {article.imageUrl && (
          <div className="relative aspect-video w-full">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={article.imageHint}
            />
            {article.attributionHtml && (
              <div
                className="image-attribution absolute bottom-2 right-2 text-xs text-white/80 bg-black/50 p-1 px-2 rounded-md"
                dangerouslySetInnerHTML={{ __html: article.attributionHtml }}
              />
            )}
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{article.title}</CardTitle>
          <p className="text-muted-foreground pt-2">{article.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-xl">
                <Dice5 className="h-5 w-5" />
                Dette trenger dere
              </h3>
              <ul className="list-disc list-inside space-y-1 text-base">
                {article.whatYouNeed.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-xl">
                <HelpCircle className="h-5 w-5" />
                Slik spiller dere
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-base">
                {article.rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ol>
            </div>

            {article.variants && article.variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-xl">
                  <Layers className="h-5 w-5" />
                  Varianter og Regler
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {article.variants.map((variant, i) => (
                    <AccordionItem value={`item-${i}`} key={i}>
                      <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline">
                        {variant.title}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <p className="text-muted-foreground">{variant.description}</p>
                        <ol className="list-decimal list-inside space-y-2 text-base">
                          {variant.rules.map((rule, j) => (
                            <li key={j}>{rule}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {article.cardRules && (
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-xl">
                  <Crown className="h-5 w-5" />
                  Kortregler for {article.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {Object.entries(article.cardRules).map(([card, rule]) => (
                    <div
                      key={card}
                      className="rounded-md border border-border/50 p-4 bg-card/40"
                    >
                      <p className="font-bold text-foreground">{card}</p>
                      <p className="mt-1">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
