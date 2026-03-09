export const INFO_PAGE_META = {
  'om-oss': {
    title: 'Vårt Mål: Mer Moro, Mindre Styr',
    description:
      'Om GameNight, hvordan appen fungerer i dag, og hvordan prosjektet finansieres.',
  },
  personvern: {
    title: 'Personvernerklæring',
    description:
      'Hvordan GameNight håndterer lokal lagring, cookies og tredjepartstjenester.',
  },
  'kontakt-oss': {
    title: 'Kontakt Oss',
    description: 'Hvordan du kontakter teamet bak GameNight.',
  },
} as const;

export type InfoPageSlug = keyof typeof INFO_PAGE_META;

export const INFO_PAGE_SLUGS = Object.keys(INFO_PAGE_META) as InfoPageSlug[];

export function isInfoPageSlug(slug: string): slug is InfoPageSlug {
  return slug in INFO_PAGE_META;
}
