


export interface IZarrinpalValidated {
  message: string;
  code: number;
  ref_id: number;
  card_pan: string;
  card_hash: string;
  fee_type: string;
  shaparak_fee: string;
  fee: number;
  order_id: string;
}

export interface INavToPaymentRes {
  authority: string;
  redirUrl: string;
}
