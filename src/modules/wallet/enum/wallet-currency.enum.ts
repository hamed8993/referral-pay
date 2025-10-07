export enum WalletCurrencyEnum {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CHF = 'CHF',
  CAD = 'CAD',
  AUD = 'AUD',
  NZD = 'NZD',
  IRR = 'IRR',
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
}

export const getCurrenciesArray = Object.values(WalletCurrencyEnum);
