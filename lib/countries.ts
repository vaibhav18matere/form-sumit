import countryNames from "./iso3166-countries.json";

export type CountryOption = {
  readonly name: string;
};

function buildSortedCountryOptions(names: readonly string[]): CountryOption[] {
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  return sorted.map((name) => ({ name }));
}

export const ALL_COUNTRY_OPTIONS: readonly CountryOption[] =
  buildSortedCountryOptions(countryNames as string[]);

export function getSortedCountryOptions(): readonly CountryOption[] {
  return ALL_COUNTRY_OPTIONS;
}
