export type ChangelogEntry = {
  date: string;
  title: string;
  summary: string;
  items: string[];
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-03-09',
    title: 'Stabilisering av spillstart, mobilflyt og installprompt',
    summary:
      'Spillstarten ble strammet inn med tydeligere spillerkrav, mer konsistent spilleroppsett og mindre pågående PWA-promotering.',
    items: [
      'Innførte enkel minPlayers-støtte med guard i spillsiden og felles startlogikk på tvers av lister og huber.',
      'Oppdaterte spilleroppsettet slik at det forklarer hva som mangler og sender brukeren tilbake til riktig spill når kravet er oppfylt.',
      'Skjulte svake/dummy-varianter fra offentlig produktflate og tonet ned installprompten til en mobil-først, tilgjengelighetsstyrt prompt.',
    ],
  },
  {
    date: '2026-03-09',
    title: 'Statisk-first drift og hosting-opprydding',
    summary:
      'Prosjektet ble konsolidert for stabil statisk drift på GitHub Pages og Cloudflare.',
    items: [
      'Byttet til statisk-first App Router-flyt med eksportvennlig oppsett.',
      'Dokumenterte deploy, hostingstrategi og nåværende teknisk status i docs.',
      'Beholdt PWA-funksjoner med service worker og install-prompt i klient.',
    ],
  },
  {
    date: '2026-03-09',
    title: 'SEO og publisher-readiness',
    summary:
      'Målrettet runde for canonical, metadata, internlenking, semantikk og trust-sider.',
    items: [
      'La til canonical/OG/Twitter-metadata med sentral SEO-helper i Next metadata-systemet.',
      'La til structured data (Organization, WebSite, Breadcrumbs og FAQ/Article der relevant).',
      'Forbedret crawlbar internlenking, inkludert server-rendret linkgraf fra /alle-spill.',
      'La til FAQ, changelog og vilkår + ads.txt-placeholder for AdSense-forberedelse.',
    ],
  },
];
