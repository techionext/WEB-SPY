import { currencies as countryCurrencyList, countries } from "country-data-list";

interface LibraryCurrency {
  code: string;
  name: string;
  symbol?: string;
}

interface LibraryCountry {
  currencies: string[];
  emoji?: string;
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

export const currencies: Currency[] = (countryCurrencyList.all as LibraryCurrency[])
  .filter((c) => c.code && c.name)
  .map((c) => {
    const country = (countries.all as LibraryCountry[]).find((country) =>
      country.currencies?.includes(c.code),
    );

    const name = c.name.split(" (")[0];

    return {
      code: c.code,
      name,
      flag: country?.emoji || "🌐",
      symbol: c.symbol || c.code,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
