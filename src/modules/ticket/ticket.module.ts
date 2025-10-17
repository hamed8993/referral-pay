import { Module } from '@nestjs/common';
import { InvoiceModule } from '../invoice/invoice.module';
import { TicketController } from './ticket.controller';
import { UploadModule } from '../multer/multer.module';
import { TicketService } from './ticket.service';

@Module({
  providers: [TicketService],
  controllers: [TicketController],
  imports: [InvoiceModule],
})
export class TicketModule {}
