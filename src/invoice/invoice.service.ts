import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { DataSource, Repository } from 'typeorm';
import { ICreateInvoice } from './interface/create-invoice.interface';
import { UserService } from 'src/user/user.service';
import { ICancellInvoice } from './interface/cancell-invoice.interface';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { IProcessInvoice } from './interface/process-invoice.interface';
import { Transaction } from 'src/transaction/entity/transaction.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import Decimal from 'decimal.js';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

@Injectable()
export class InvoiceService {
  constructor(
    private userService: UserService,
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    private dataSource: DataSource,
    private walletService: WalletService,
  ) {}

  async createInvoice(body: ICreateInvoice): Promise<any> {
    //Todo=>insert user by cookie
    const existInvoicerUser =
      await this.userService.findOneByEmail('neda@gmail.com');
    if (!existInvoicerUser)
      throw new BadRequestException('such a user not found!');

    const existInvoicerWallet = await this.walletService.findOneById(
      body.walletId,
    );
    if (!existInvoicerWallet)
      throw new BadRequestException('such a wallet not found!');

    if (
      body.invoiceType === TransactionType.WITHDRAWAL &&
      body.subtotal > existInvoicerWallet.balance
    )
      throw new ForbiddenException(
        'amount of invoice <subtotal> is greater than wallet balance!',
      );

    const result = await this.invoiceRepo.create({
      title: body.title,
      subtotal: body.subtotal,
      paymentGateway: body.paymentGateway,
      paymentReference: body.paymentReference,
      type: body.invoiceType,
      wallet: existInvoicerWallet,
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
      relations: ['wallet'],
    });
    if (!existInvoice) throw new NotFoundException('Such a invoice not exist!');

    if (body.status === InvoiceStatus.REJECTED) {
      return await this.invoiceRepo.update(
        { invoiceNumber: body.invoiceNumber },
        {
          status: InvoiceStatus.REJECTED,
          adminNote: body.adminNote,
          processedAt: new Date(),
          processedBy: 3,
        },
      );
    } else if (body.status === InvoiceStatus.SUBMITTED) {
      return this.dataSource.transaction(async (manager) => {
        await manager.update(
          Invoice,
          {
            invoiceNumber: body.invoiceNumber,
          },
          {
            status: InvoiceStatus.SUBMITTED,
            adminNote: body.adminNote,
            processedAt: new Date(),
            processedBy: 3,
          },
        );

        const newTransaction = await manager.create(Transaction, {
          processedBy: 3,
          type: existInvoice.type,
          amount: existInvoice.totalAmount,
          fee: 0, //===>??????
          invoice: existInvoice,
          title: existInvoice.title,
          wallet: existInvoice.wallet,
          user: existInvoice.user,
          description: existInvoice.description, //?????
          transactionTracingCode: '????', //??????
        });
        await manager.save(Transaction, newTransaction);

        let walletNewBalance = 0;
        if (existInvoice.type === TransactionType.DEPOSIT) {
          walletNewBalance = new Decimal(existInvoice.wallet.balance)
            .plus(existInvoice.totalAmount)
            .toNumber();
        } else if (existInvoice.type === TransactionType.WITHDRAWAL) {
          if (existInvoice.subtotal > existInvoice.wallet.balance) {
            throw new ForbiddenException(
              'amount of invoice <subtotal> is greater than wallet balance!',
            );
          }
          walletNewBalance = new Decimal(existInvoice.wallet.balance)
            .minus(existInvoice.totalAmount)
            .toNumber();
        }

        await manager.update(
          Wallet,
          { id: existInvoice.wallet.id },
          {
            balance: walletNewBalance,
          },
        );
      });
    }
  }
}
