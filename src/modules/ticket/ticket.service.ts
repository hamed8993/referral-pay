import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class TicketService {
  constructor(private invoiceService: InvoiceService) {}
  async registerDepositInvoiceDoc(
    docUrl: string,
    invoiceNumber: string,
    userId: string,
  ): Promise<any> {
    const invoice = await this.invoiceService.findOne({
      invoiceNumber,
    });
    if (!invoice) throw new NotFoundException('such a invoice not found!');

    if (invoice.depositDocUrl)
      throw new BadRequestException(
        'you uploaded already. be patient for inspection by our Admin!',
      );
      
    return await this.invoiceService.updateByInvoiceNumberForUserByError({
      userId,
      invoiceNumber,
      updatePayload: {
        depositDocUrl: docUrl,
      },
    });
  }
}
