import { BadRequestException, Injectable } from '@nestjs/common';
import { ITransfer } from './interface/transfer.interface';
import { GatewayService } from '../gateway/gateway.service';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { GatewayDispatcherService } from '../gateway/gateway-dispatcher.service';

@Injectable()
export class TransferService {
  constructor(
    private gatewayService: GatewayService,
    private gatewayDispatcher: GatewayDispatcherService,
  ) {}
  async dispatcher(body: ITransfer, user: ValidatedJwtUser): Promise<any> {
    const gateway = await this.gatewayService.findOneActiveById(body.gatewayId);
    if (!gateway) throw new BadRequestException('Such a GATEWAY not found!');

    return this.gatewayDispatcher.dispatch(gateway, body, user);
  }
}
