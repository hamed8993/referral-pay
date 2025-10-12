import { GatewayType } from 'src/common/enums/gateway-type.enum';

export interface IcreateGateway {
  displayName: string;
  name: string;
  gatewayType: GatewayType;
  handler: string;
  imgUrl?: string;

  productRequestUrl?: string;
  sandboxRequestUrl?: string;
  productPaymentUrl?: string;
  sandboxPaymentUrl?: string;
  productCallbackUrl?: string;
  sandboxCallbackUrl?: string;
  productVerifyUrl?: string;
  sandboxVerifyUrl?: string;
  merchantId?: string;
  apiKey?: string;
  merchantCode?: string;
  terminalCode?: string;
  terminalId?: string;
  privateKey?: string;
  certificate?: string;
  username?: string;
  password?: string;
}
