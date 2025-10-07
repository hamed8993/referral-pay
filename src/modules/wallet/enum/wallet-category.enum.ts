export enum WalletCategoryEnum {
  MAIN = 'main',
  SPOT = 'spot',
  FEATURE = 'feature',
}

export const getWalletCategoriesArray = Object.values(WalletCategoryEnum);
