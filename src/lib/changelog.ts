export type ChangelogEntry = {
  date: string;
  title: string;
  summary: string;
  items: string[];
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-03-09',
    title: 'Tydeligere infosider og produktidentitet',
    summary:
      'Om GameNight, FAQ, vilkår, kontakt og oppdateringssiden ble skrevet om for å gjøre GameNight enklere å forstå og lettere å stole på.',
    items: [
      'Forklarte tydeligere at GameNight er gratis å bruke, uten login, abonnement eller betalte spillpakker.',
      'La inn mer praktisk hjelp om spilling på én mobil, AirPlay på iPhone og Cast/skjermdeling på Android.',
      'Strammet opp språk rundt ansvarlig alkoholbruk, 18+ og frivillige donasjoner.',
    ],
  },
  {
    date: '2026-03-09',
    title: 'Enklere spillstart og bedre mobilflyt',
    summary:
      'Det ble lettere å komme raskt i gang med riktig antall spillere og mindre friksjon før første kort.',
    items: [
      'Spill med spillerkrav forklarer tydeligere hva som mangler før dere kan starte.',
      'Spilleroppsettet sender dere tilbake til riktig spill når lista er klar.',
      'Installering på mobil ble tonet ned til en valgfri snarvei i stedet for et masete steg.',
    ],
  },
  {
    date: '2026-03-09',
    title: 'Bedre oversikt, trust-signaler og hjelpesider',
    summary:
      'GameNight fikk tydeligere hjelpesider og bedre grunnmur for å vise at tjenesten faktisk vedlikeholdes.',
    items: [
      'La til egne sider for FAQ, vilkår og oppdateringer.',
      'Gjorde viktige infosider enklere å finne fra footer og internlenker.',
      'Ryddet grunnleggende sideinformasjon slik at GameNight får en mer konsistent presentasjon i søk og deling.',
    ],
  },
  {
    date: '2026-03-09',
    title: 'Mer stabil publisering og enklere vedlikehold',
    summary:
      'Det ble gjort opprydding i grunnstrukturen for å gjøre GameNight mer forutsigbar å publisere og enklere å holde oppdatert videre.',
    items: [
      'Strammet opp publiseringsoppsettet slik at flere sider fungerer mer stabilt på tvers av miljøer.',
      'Beholdt rask åpning, installering som valg og støtte for bruk på mobil og delt skjerm.',
      'Dokumenterte dagens status bedre i repoet for å gjøre videre forbedringer raskere å rulle ut.',
    ],
  },
];
