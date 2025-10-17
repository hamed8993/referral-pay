import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class TicketService {
  constructor(private invoiceService: InvoiceService) {}
  async registerDepositInvoiceDoc(
    docUrl: string,
    invoiceNumber: string,
    userId: string,
  ): Promise<any> {
    return await this.invoiceService.updateByInvoiceNumberForUserByError({
      userId,
      invoiceNumber,
      updatePayload: {
        depositDocUrl: docUrl,
      },
    });
  }
}
