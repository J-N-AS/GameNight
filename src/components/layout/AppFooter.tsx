import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="w-full flex-shrink-0 py-6 px-4 md:px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center text-sm text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} GameNight</span>
        <div className="flex gap-4">
          <Link href="/info/om-oss" className="hover:text-foreground transition-colors">
            Om oss
          </Link>
          <Link href="/info/personvern" className="hover:text-foreground transition-colors">
            Personvern
          </Link>
        </div>
      </div>
    </footer>
  );
}
