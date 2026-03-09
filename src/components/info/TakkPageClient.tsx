'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function TakkPageClient() {
  return (
    <motion.div
      className="container mx-auto flex min-h-screen items-center justify-center p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <Card className="max-w-md text-center">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-4"
          >
            <Heart className="h-16 w-16 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold">Tusen takk for støtten!</h1>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Ditt bidrag hjelper oss med å holde serverne i gang og utvikle nye,
            morsomme spill for deg og vennene dine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" asChild>
            <Link href="/">Tilbake til forsiden</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
