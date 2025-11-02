import { IsEnum, IsString } from 'class-validator';
import { GatewayType } from 'src/common/enums/gateway-type.enum';
import { PartialType } from '@nestjs/swagger';

class BaseGatewayDto {
  @IsString()
  imgUrl: string;

  @IsString()
  merchantCode: string;

  @IsString()
  terminalCode: string;

  @IsString()
  terminalId: string;

  @IsString()
  privateKey: string;

  @IsString()
  certificate: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  /////
  @IsString()
  productRequestUrl: string;

  @IsString()
  sandboxRequestUrl: string;

  @IsString()
  productCallbackUrl: string;

  @IsString()
  sandboxCallbackUrl: string;

  @IsString()
  productPaymentUrl: string;

  @IsString()
  sandboxPaymentUrl: string;

  @IsString()
  productVerifyUrl: string;

  @IsString()
  sandboxVerifyUrl: string;

  // @ValidateIf((o) => !o.apiKey)
  @IsString()
  merchantId: string;

  // @ValidateIf((o) => !o.merchantId)
  @IsString()
  apiKey: string;
}

export class CreateGatewayDto extends PartialType(BaseGatewayDto) {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEnum(GatewayType)
  gatewayType: GatewayType;

  @IsString()
  handler: string;
}
