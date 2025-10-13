import Decimal from 'decimal.js';

export function isAmountGreaterThanUnlockedBalance(args: {
  invoiceAmount: number;
  walletBalance: number;
  walletLockedBalance: number;
}) {
  const amount = new Decimal(args.invoiceAmount);
  const balance = new Decimal(args.walletBalance);
  const lockedBalance = new Decimal(args.walletLockedBalance);

  const available = balance.minus(lockedBalance);

  return amount.greaterThan(available);
}
