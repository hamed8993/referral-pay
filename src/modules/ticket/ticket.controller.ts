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
import {
  DepositDocBodyDto,
  UploadDocDto,
} from './dto/requests/deposit-doc.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { Request as ExpressRequest } from 'express';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { existsSync, mkdirSync } from 'fs';
import { MulterService } from '../multer/multer.service';
import { getMulterConfig } from '../multer/helper/get-multer.config';
import { TicketService } from './ticket.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { securitySchemeName } from 'swagger.config';
import { UploadDepositDocDto } from './dto/responses/deposit-doc.response.dto';

@ApiBearerAuth(securitySchemeName)
@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Post('transfer/doc')
  @UseInterceptors(
    FileInterceptor(
      'doc',
      getMulterConfig({
        destAfterBase: 'deposit-docs',
        uniqueFileName: (req: ExpressRequest) =>
          `${(req.user as ValidatedJwtUser).email as string}-${Date.now()}`,
        fileTypes: /^image\/(jpg|jpeg|png|gif|bmp|webp)$/i,
      }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadDocDto,
  })
  async uploadDepositDoc(
    @UploadedFile() doc: Express.Multer.File,
    @Body() body: DepositDocBodyDto,
    @Request() req,
  ): Promise<UploadDepositDocDto> {
    const user: ValidatedJwtUser = req.user;
    const res = await this.ticketService.registerDepositInvoiceDoc(
      doc.destination,
      body.invoiceNumber,
      user.id.toString(),
    );
    return {
      data: { depositDocUrl: res.depositDocUrl },
    };
  }
}
