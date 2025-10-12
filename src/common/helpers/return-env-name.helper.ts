export const returnEnvName: () => 'product' | 'sandbox' = () => {
  return process.env.ENV === 'product' ? 'product' : 'sandbox';
};
