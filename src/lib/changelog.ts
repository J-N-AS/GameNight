export type ChangelogEntry = {
  date: string;
  dateLabel?: string;
  emoji: string;
  tag: string;
  title: string;
  summary: string;
  items: string[];
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-03-09',
    dateLabel: 'Ca. tidlig mars 2026',
    emoji: '✨',
    tag: 'Glow-up',
    title: 'Infosidene fikk en skikkelig glow-up',
    summary:
      'Vi ryddet opp i hvordan GameNight presenterer seg selv, så det føles mindre tilfeldig sideprosjekt og mer som et produkt du faktisk tør å sende videre til folk.',
    items: [
      'Skrev om Om oss, FAQ, vilkår, kontakt og denne oppdateringssiden med tydeligere språk og litt mer personlighet.',
      'Gjorde det enklere å forstå at GameNight er gratis, uten login, abonnement eller låste spillpakker.',
      'La inn flere små trust-signaler rundt 18+, ansvarlig bruk og hvordan tjenesten faktisk fungerer i praksis.',
    ],
  },
  {
    date: '2026-03-03',
    dateLabel: 'Ca. første uka i mars 2026',
    emoji: '🚀',
    tag: 'Flyt',
    title: 'Spillstart gikk fra "vent litt" til "ok, kjør"',
    summary:
      'Målet var å fjerne de små irriterende stegene mellom "vi skal spille noe" og det øyeblikket første kort faktisk dukker opp på skjermen.',
    items: [
      'Spill med spillerkrav forklarer tydeligere hva som mangler før dere kan starte.',
      'Når spillerlista er klar, sendes dere tilbake til riktig spill i stedet for å måtte lete dere fram igjen.',
      'Installasjon på mobil ble tonet ned til en hyggelig snarvei, ikke et stopp-skilt midt i flyten.',
    ],
  },
  {
    date: '2026-02-24',
    dateLabel: 'Ca. slutten av februar 2026',
    emoji: '🎉',
    tag: 'Innhold',
    title: 'Spillmiksen føltes mer som en faktisk vorspiel-meny',
    summary:
      'Vi begynte å stramme opp hvordan spill og kategorier oppleves, så det blir lettere å finne noe som passer enten dere vil ha kaos, flørting eller bare komme i gang.',
    items: [
      'Finjusterte miksene så forskjellige typer kvelder får litt tydeligere personlighet.',
      'Gjorde det enklere å hoppe mellom klassiske drikkeleker, raske partyspill og mer sosiale isbrytere.',
      'Ryddet i tekst og struktur så færre sider føles som stubber og flere føles som ekte anbefalinger.',
    ],
  },
  {
    date: '2026-02-12',
    dateLabel: 'Ca. midten av februar 2026',
    emoji: '📱',
    tag: 'Mobil + TV',
    title: 'Én mobil først, TV når kvelden fortjener det',
    summary:
      'Vi gjorde produktfortellingen tydeligere: GameNight er laget for én skjerm som styrer alt, men fungerer også kjempefint når dere vil caste til noe større.',
    items: [
      'La inn mer konkret hjelp for AirPlay på iPhone og Cast/skjermdeling på Android.',
      'Skrev tydeligere at installasjon bare er en valgfri snarvei og ikke noe dere trenger for å spille.',
      'Gjorde mobilopplevelsen mer konsekvent så den passer bedre til faktisk bruk rundt et bord.',
    ],
  },
  {
    date: '2026-01-28',
    dateLabel: 'Ca. slutten av januar 2026',
    emoji: '🧃',
    tag: 'Vibe',
    title: 'Mer juice i smådetaljene',
    summary:
      'Ikke alt var en stor feature. En del av løftet kom fra mange små justeringer som samlet gjør at GameNight føles mindre hakkete og mer gjennomtenkt.',
    items: [
      'Strammet opp tekst, knapper og små hjelpetekster der folk typisk blir usikre.',
      'Jevnet ut noen rare overganger mellom lister, infosider og spillsider.',
      'Gjorde flere deler av produktet litt mindre "prototype" og litt mer "ja, dette funker faktisk".',
    ],
  },
  {
    date: '2025-12-18',
    dateLabel: 'Ca. desember 2025',
    emoji: '🛠️',
    tag: 'Grunnmur',
    title: 'Mer orden bak kulissene',
    summary:
      'Vi gjorde en runde på strukturen i prosjektet, ikke fordi det er sexy, men fordi det gjør resten lettere å bygge og publisere uten overraskelser.',
    items: [
      'Ryddet i sideoppsett og grunnleggende metadata så deling og søk blir mer konsistent.',
      'Gjorde publiseringsoppsettet mindre skjørt på tvers av miljøer.',
      'Dokumenterte mer av dagens setup så videre forbedringer går raskere å rulle ut.',
    ],
  },
  {
    date: '2025-11-30',
    dateLabel: 'Ca. sent i 2025',
    emoji: '🌙',
    tag: 'Starten',
    title: 'GameNight begynte å ligne på GameNight',
    summary:
      'Dette var perioden der ideen gikk fra "vi burde lage noe" til et faktisk konsept: norsk, raskt å starte, sosialt rundt én skjerm og uten unødvendig paywall-stemning.',
    items: [
      'La retningen for at GameNight skal være gratis å bruke og lett å dele med venner.',
      'Bestemte at én mobil eller nettleser skal kunne styre hele spilløkten uten konto og styr.',
      'Satte tonen for at noen spill kan være drikkespill, men at gruppa alltid styrer nivå, regler og grenser selv.',
    ],
  },
];
