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
    title: 'Infosidene sluttet å mumle',
    summary:
      'Vi tok en skikkelig rydderunde på sidene rundt spillet, så det ble lettere å skjønne hva GameNight er, hvordan det funker og hvorfor det ikke krever masse styr.',
    items: [
      'Skrev om Om oss, FAQ, vilkår, kontakt og oppdateringssiden med kortere og tydeligere språk.',
      'Gjorde det mye enklere å se at GameNight er gratis, uten login og uten låste spillpakker.',
      'La inn tryggere rammer rundt 18+, ansvar og hvordan tjenesten faktisk brukes i praksis.',
    ],
  },
  {
    date: '2026-03-03',
    dateLabel: 'Ca. første uka i mars 2026',
    emoji: '🚀',
    tag: 'Flyt',
    title: 'Lynrask spillstart',
    summary:
      'Vi jaget bort de små stegene mellom "skal vi spille noe?" og første kort på skjermen.',
    items: [
      'Spill med spillerkrav sier tydelig fra om hva som mangler før dere kan starte.',
      'Når spillerlista er klar, havner dere tilbake i riktig spill i stedet for å måtte lete.',
      'Mobilinstallasjon ble en valgfri snarvei, ikke en stoppkloss midt i moroa.',
    ],
  },
  {
    date: '2026-02-24',
    dateLabel: 'Ca. slutten av februar 2026',
    emoji: '🎉',
    tag: 'Innhold',
    title: 'Spillmiksen fikk mer personlighet',
    summary:
      'Mindre tilfeldig katalog, mer faktisk meny for kvelder med ulik stemning.',
    items: [
      'Finjusterte miksene så kaoskvelder, flørtestemning og rolige oppstarter føles mer forskjellige.',
      'Gjorde det enklere å hoppe mellom drikkeleker, partyspill og sosiale isbrytere.',
      'Ryddet i tekster og struktur så flere sider føles ferdige, ikke halvveis.',
    ],
  },
  {
    date: '2026-02-12',
    dateLabel: 'Ca. midten av februar 2026',
    emoji: '📱',
    tag: 'Mobil + TV',
    title: 'Mobil først, TV når dere vil',
    summary:
      'GameNight ble tydeligere som en en-skjermsgreie som også spiller fint med større skjermer.',
    items: [
      'La inn mer konkret hjelp for AirPlay på iPhone og Cast/skjermdeling på Android.',
      'Skrev tydeligere at installasjon bare er en valgfri snarvei.',
      'Jevnet ut mobilopplevelsen så den sitter bedre rundt et faktisk bord.',
    ],
  },
  {
    date: '2026-01-28',
    dateLabel: 'Ca. slutten av januar 2026',
    emoji: '🧃',
    tag: 'Vibe',
    title: 'Smågrep som gjør kvelden glattere',
    summary:
      'Ingen stor feature-drop, bare mange små justeringer som gjør at appen føles mindre hakkete.',
    items: [
      'Strammet opp tekst, knapper og hjelpetekster der folk ofte stopper opp.',
      'Jevnet ut noen rare overganger mellom lister, infosider og spillsider.',
      'Gjorde flere småting litt mindre prototype og litt mer "ja, dette funker".',
    ],
  },
  {
    date: '2025-12-18',
    dateLabel: 'Ca. desember 2025',
    emoji: '🛠️',
    tag: 'Grunnmur',
    title: 'Mer orden bak kulissene',
    summary:
      'Den litt usynlige jobben: rydde struktur og publisering før flere ting bygges videre.',
    items: [
      'Ryddet i sideoppsett og grunnleggende metadata så deling og søk blir mer konsistent.',
      'Gjorde publiseringsoppsettet mindre skjørt på tvers av miljøer.',
      'Dokumenterte mer av setupen så nye forbedringer går raskere å rulle ut.',
    ],
  },
  {
    date: '2025-11-30',
    dateLabel: 'Ca. sent i 2025',
    emoji: '🌙',
    tag: 'Starten',
    title: 'Da GameNight begynte å ligne på seg selv',
    summary:
      'Dette var fasen der ideen gikk fra løs tanke til et norsk partyspill-opplegg som er raskt å starte og lett å dele.',
    items: [
      'La retningen for at GameNight skal være gratis å bruke og enkelt å sende videre.',
      'Bestemte at én mobil eller nettleser skal kunne styre hele spilløkten uten konto.',
      'Satte tonen for at gruppa styrer nivå, regler og grenser selv.',
    ],
  },
];
