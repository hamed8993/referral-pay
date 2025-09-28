import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { Repository } from 'typeorm';
import { ICreateInvoice } from './interface/create-invoice.interface';
import { UserService } from 'src/user/user.service';
import { ICancellInvoice } from './interface/cancell-invoice.interface';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { IProcessInvoice } from './interface/process-invoice.interface';

@Injectable()
export class InvoiceService {
  constructor(
    private userService: UserService,
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
  ) {}

  async createInvoice(body: ICreateInvoice): Promise<any> {
    //Todo=>insert user by cookie
    const existInvoicerUser =
      await this.userService.findOneByEmail('neda@gmail.com');
    if (!existInvoicerUser)
      throw new BadRequestException('such a user not found!');
    const result = await this.invoiceRepo.create({
      ...body,
      user: existInvoicerUser,
    });
    return await this.invoiceRepo.save(result);
  }

  async cancellInvoice(body: ICancellInvoice): Promise<any> {
    //Todo=>insert user by cookie
    const existInvoicerUser =
      await this.userService.findOneByEmail('neda@gmail.com');
    if (!existInvoicerUser) throw new BadRequestException('Ooops! Forbidden!');
    const existInvoice = await this.invoiceRepo.findOne({
      where: {
        invoiceNumber: body.invoiceNumber,
      },
    });
    if (!existInvoice) throw new NotFoundException('Such a invoice not exist!');
    return await this.invoiceRepo.update(
      {
        invoiceNumber: body.invoiceNumber,
      },
      {
        status: InvoiceStatus.CANCELLED,
        userCancellDescription: body.userCancellDescription,
      },
    );
  }

  async processByAdmin(body: IProcessInvoice): Promise<any> {
    //Todo=>insert admin by cookie
    const existInvoice = await this.invoiceRepo.findOne({
      where: {
        invoiceNumber: body.invoiceNumber,
      },
    });
    if (!existInvoice) throw new NotFoundException('Such a invoice not exist!');
    return await this.invoiceRepo.update(
      {
        invoiceNumber: body.invoiceNumber,
      },
      {
        status: body.status,
        adminNote: body.adminNote,
        processedAt: new Date(),
        processedBy: 3,
      },
    );
  }
}
