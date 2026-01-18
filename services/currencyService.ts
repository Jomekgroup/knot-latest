
export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // Rate relative to 1 USD
}

export const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  "United States of America": { code: "USD", symbol: "$", rate: 1 },
  "Nigeria": { code: "NGN", symbol: "₦", rate: 1600 },
  "United Kingdom": { code: "GBP", symbol: "£", rate: 0.79 },
  "Canada": { code: "CAD", symbol: "C$", rate: 1.36 },
  "India": { code: "INR", symbol: "₹", rate: 83.45 },
  "Ghana": { code: "GHS", symbol: "GH₵", rate: 15.20 },
  "Kenya": { code: "KES", symbol: "KSh", rate: 131.50 },
  "South Africa": { code: "ZAR", symbol: "R", rate: 18.80 },
  "Pakistan": { code: "PKR", symbol: "Rs", rate: 278.50 },
  "Mexico": { code: "MXN", symbol: "$", rate: 16.70 },
  "Brazil": { code: "BRL", symbol: "R$", rate: 5.15 },
  "United Arab Emirates": { code: "AED", symbol: "AED", rate: 3.67 },
};

export const DEFAULT_CURRENCY: CurrencyInfo = { code: "USD", symbol: "$", rate: 1 };

/**
 * Returns formatted localized price based on country
 */
export const formatLocalPrice = (usdAmount: number, country: string = "USA"): string => {
  const info = CURRENCY_MAP[country] || DEFAULT_CURRENCY;
  const localValue = usdAmount * info.rate;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: info.code,
    currencyDisplay: 'symbol',
  }).format(localValue).replace(info.code, info.symbol);
};

/**
 * Returns currency info for a specific country
 */
export const getCurrencyForCountry = (country: string): CurrencyInfo => {
  return CURRENCY_MAP[country] || DEFAULT_CURRENCY;
};
