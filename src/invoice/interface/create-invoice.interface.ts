export interface ICreateInvoice {
  title: string;

  subtotal: number;

  paymentGateway: string;

  paymentReference: string;
}
