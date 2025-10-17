import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DepositDocDto } from './dto/deposit-doc-dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { Request as ExpressRequest } from 'express';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { existsSync, mkdirSync } from 'fs';
import { MulterService } from '../multer/multer.service';
import { getMulterConfig } from '../multer/helper/get-multer.config';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post('transfer/doc')
  @UseInterceptors(
    FileInterceptor(
      'doc',
      getMulterConfig({
        destAfterBase: (req: ExpressRequest) =>
          (req.user as ValidatedJwtUser).email as string,
      }),
    ),
  )
  async uploadDepositDoc(
    @UploadedFile() doc: Express.Multer.File,
    @Body() body: DepositDocDto,
    @Request() req,
  ): Promise<any> {
    const user: ValidatedJwtUser = req.user;
    return await this.ticketService.registerDepositInvoiceDoc(
      doc.destination,
      body.invoiceNumber,
      user.id.toString(),
    );
  }
}
