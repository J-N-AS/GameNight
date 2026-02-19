import { getTheme } from '@/lib/themes';
import { ThemePageClient } from '@/components/themes/ThemePageClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Fadderuka: Spill, Leker & Isbrytere for Studiestart | GameNight',
  description: 'Den ultimate guiden for fadderuken! Finn de beste isbryterne, selskapslekene og partyspillene som garanterer en uforglemmelig studiestart.',
};

const IcebreakerArticles = () => (
    <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
        <Separator />
        <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                Topp 3 fysiske isbrytere for faddergruppen
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
                Trenger dere en pause fra kortene? Her er tre enkle og hysterisk morsomme leker som garantert får opp energien og samholdet.
            </p>
        </div>
        <div className="space-y-8">
            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                        <span className="text-2xl">🏷️</span>
                        Hvem er jeg? (Kjendis-leken)
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed">
                    <p>En sikker vinner mens folk ankommer vorspielet! Skriv navnet på kjente personer på Post-it lapper, og fest en lapp i panna eller på ryggen til hver deltaker.</p>
                    <p>Deltakerne må mingle og stille hverandre ja/nei-spørsmål for å finne ut hvem de er. Taperne tar en felles skål til slutt!</p>
                </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                        <span className="text-2xl">🦖</span>
                        Evolusjonsleken
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed">
                    <p>Den ultimate energibomben. Alle starter som et 'Egg' ved å vralte rundt og si 'egg, egg, egg'. Når to egg møtes, spiller de stein-saks-papir. Vinneren utvikler seg til en 'Kylling' (flaks med armene), mens taperen forblir et egg.</p>
                    <p>Kyllinger møter kyllinger, og vinnerne blir 'Fugler', og til slutt 'Supermenn' (med armene i været). Det er hysterisk kaos!</p>
                </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                        <span className="text-2xl">🪢</span>
                        Menneskeknuten
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed">
                    <p>Stå i en tett sirkel. Alle lukker øynene og strekker hendene frem, og griper to tilfeldige hender (men ikke fra personen rett ved siden av).</p>
                    <p>Nå åpner dere øynene, og gruppen må samarbeide for å 'vikle ut' knuten uten at noen slipper taket. Den perfekte teambuilderen!</p>
                </CardContent>
            </Card>
        </div>
    </div>
);


export default async function FadderukaPage() {
  const theme = await getTheme('fadderuka');

  if (!theme) {
    notFound();
  }

  return (
    <>
      <ThemePageClient theme={theme} />
      <div className="container mx-auto px-4 pb-12">
        <IcebreakerArticles />
      </div>
    </>
  );
}
