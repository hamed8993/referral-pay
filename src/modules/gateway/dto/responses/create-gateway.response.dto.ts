import { CommonApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { Gateway } from '../../entity/gateway.entity';
import { IControllerResponse } from 'src/common/interface/api-response.interface';
import { GatewayType } from 'src/common/enums/gateway-type.enum';
import { GatewayProviderEnum } from 'src/common/enums/gateway-provider.enum';
import { ApiProperty } from '@nestjs/swagger';

// class CreateGatewayResponse extends Gateway {}

class Credentials {
  @ApiProperty()
  merchantId?: string;

  @ApiProperty()
  apiKey?: string;

  @ApiProperty()
  terminalId?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  privateKey?: string;

  @ApiProperty()
  certificate?: string;

  //   @ApiProperty()
  //   [key: string]: any;
}

class EndpointsItem {
  requestUrl: string;

  @ApiProperty()
  paymentUrl: string;

  @ApiProperty()
  callbackUrl: string;

  @ApiProperty()
  verifyUrl: string;

  //   @ApiProperty()
  //   [key: string]: any;
}

class Endpoints {
  @ApiProperty()
  sandbox: EndpointsItem;

  @ApiProperty()
  production: EndpointsItem;
}

class CreateGatewayResponse {
  @ApiProperty()
  name: string; //zarinpal , ....

  @ApiProperty()
  gatewayType: GatewayType;

  @ApiProperty()
  handler: string;

  @ApiProperty()
  provider: GatewayProviderEnum;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  displayName: string; // 'درگاه زرین پال'

  @ApiProperty()
  credentials: Credentials;

  @ApiProperty()
  endpoints: Endpoints;

  @ApiProperty()
  additionalConfig: Record<string, string | number>;

  @ApiProperty()
  imgUrl: string;
}

export class CreateGatewayResponseDto
  extends CommonApiResponseDto
  implements IControllerResponse<CreateGatewayResponse>
{
  data: CreateGatewayResponse;
}
