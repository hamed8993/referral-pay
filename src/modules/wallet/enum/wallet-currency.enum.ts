export enum WalletCurrencyEnum {
  USD = 'USD',
  USDT = 'USDT',
  IRR = 'IRR',

  // EUR = 'EUR',
  // GBP = 'GBP',
  // JPY = 'JPY',
  // CHF = 'CHF',
  // CAD = 'CAD',
  // AUD = 'AUD',
  // NZD = 'NZD',
  // BTC = 'BTC',
  // ETH = 'ETH',
}

export const getCurrenciesArray = Object.values(WalletCurrencyEnum) as WalletCurrencyEnum[];;
