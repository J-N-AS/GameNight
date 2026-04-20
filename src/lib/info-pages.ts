export const INFO_PAGE_META = {
  'om-oss': {
    title: 'Om GameNight',
    description:
      'Hva GameNight er, hvorfor tjenesten finnes, hvordan dere spiller på én mobil eller TV, og hvorfor den er gratis uten login eller abonnement.',
  },
  personvern: {
    title: 'Personvern',
    description:
      'Hvordan GameNight bruker lokal lagring, Google Analytics, Google AdSense og samtykke i nettleseren din.',
  },
  'kontakt-oss': {
    title: 'Kontakt GameNight',
    description:
      'Kontakt GameNight for spørsmål, feil, forslag til spill og publisherinformasjon.',
  },
  'redaksjonell-policy': {
    title: 'Redaksjonell policy',
    description:
      'Hvordan GameNight redigerer, kvalitetssikrer og oppdaterer artikler om drikkeleker og festspill.',
  },
} as const;

export type InfoPageSlug = keyof typeof INFO_PAGE_META;

export const INFO_PAGE_SLUGS = Object.keys(INFO_PAGE_META) as InfoPageSlug[];

export function isInfoPageSlug(slug: string): slug is InfoPageSlug {
  return slug in INFO_PAGE_META;
}
