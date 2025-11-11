export interface CountryItem {
  code: string;
  name: string;
  flags: string;
}

interface CountryApiRaw {
  cca2: string;
  name: {
    common: string;
  };
  flags: {
    svg: string;
  };
}

export const fetchCountries = async (): Promise<CountryItem[]> => {
  const fieldsToFetch = 'cca2,name,flags';

  const response = await fetch(
    `https://restcountries.com/v3.1/all?fields=${fieldsToFetch}`
  );

  const data: CountryApiRaw[] = await response.json();

  const sortedCountries: CountryItem[] = data
    .map((country: CountryApiRaw) => ({
      code: country.cca2,
      name: country.name.common,
      flags: country.flags.svg,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return sortedCountries;
};
