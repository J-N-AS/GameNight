export const locations = {
  "Oslo": ["Oslo Vest", "Oslo Øst", "Oslo Sentrum"],
  "Akershus": ["Bærum", "Asker", "Follo", "Romerike"],
  "Rogaland": ["Stavanger", "Sandnes", "Karmøy", "Tysvær", "Haugesund"],
  "Vestland": ["Bergen"],
  "Trøndelag": ["Trondheim"]
};
export type Region = keyof typeof locations;
