import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { DataSource, Repository } from 'typeorm';
import { ICreateInvoice } from './interface/create-invoice.interface';
import { UserService } from 'src/modules/user/user.service';
import { ICancellInvoice } from './interface/cancell-invoice.interface';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { IProcessInvoice } from './interface/process-invoice.interface';
import { Transaction } from 'src/modules/transaction/entity/transaction.entity';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import Decimal from 'decimal.js';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { EmailProducer } from 'src/queue/producers/email.producer';
import { ValidatedJwtUser } from 'src/modules/auth/interfaces/payload.interface';

@Injectable()
export class InvoiceService {
  constructor(
    private userService: UserService,
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    private dataSource: DataSource,
    private walletService: WalletService,
    private emailProducer: EmailProducer,
  ) {}

  async createInvoice(
    body: ICreateInvoice,
    user: ValidatedJwtUser,
  ): Promise<any> {
    //Done=>insert user by cookie
    const existInvoicerUser = await this.userService.findOneByEmail(user.email);
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

  async cancellInvoice(
    body: ICancellInvoice,
    user: ValidatedJwtUser,
  ): Promise<any> {
    //Done=>insert user by cookie
    const existInvoicerUser = await this.userService.findOneByEmail(user.email);
    if (!existInvoicerUser) throw new BadRequestException('Ooops! Forbidden!');
    const existInvoice = await this.invoiceRepo.findOne({
      where: {
        invoiceNumber: body.invoiceNumber,
      },
      relations: {
        user: {
          parent: true,
        },
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

  async processByAdmin(
    body: IProcessInvoice,
    admin: ValidatedJwtUser,
  ): Promise<any> {
    //Done=>insert admin by cookie
    const existInvoice = await this.invoiceRepo.findOne({
      where: {
        invoiceNumber: body.invoiceNumber,
      },
      // relations: ['wallet', 'user'],
      relations: {
        wallet: true,
        user: {
          parent: true,
        },
      },
    });
    if (!existInvoice) throw new NotFoundException('Such a invoice not exist!');

    switch (existInvoice.status) {
      case InvoiceStatus.REJECTED:
        throw new BadRequestException('already have been rejected!');
        break;

      case InvoiceStatus.SUBMITTED:
        throw new BadRequestException('already have been submitted!');
        break;

      case InvoiceStatus.CANCELLED:
        throw new BadRequestException(
          'already have been rejcancelled by user!',
        );
        break;

      default:
        if (body.status === InvoiceStatus.REJECTED) {
          existInvoice.status = InvoiceStatus.REJECTED;
          existInvoice.adminNote = body.adminNote;
          existInvoice.processedAt = new Date();
          existInvoice.processedBy = admin.id;
          const result = await this.invoiceRepo.save(existInvoice);
          if (!result) throw new BadRequestException('Update failed!');

          this.emailProducer.addInstanceEmailQueueJob({
            userEmail: existInvoice.user.email,
            type: existInvoice.type,
            amount: existInvoice.totalAmount,

            title: existInvoice.title,
            description: existInvoice.description || '-',
            fee: 0,
            netAmount: existInvoice.totalAmount,
            invoiceNumber: existInvoice.invoiceNumber,
            //Done=>insert admin by cookie
            processedBy: admin.email,
            processDescription: existInvoice.adminNote,
            walletId: NaN,
            status: InvoiceStatus.REJECTED,
          });

          return {
            success: true,
            message: 'Invoice rejected successfully',
            data: result,
          };
        } else if (body.status === InvoiceStatus.SUBMITTED) {
          return this.dataSource.transaction(async (manager) => {
            try {
              //1)INVOICE:
              const resInvoice = await manager.update(
                Invoice,
                {
                  invoiceNumber: body.invoiceNumber,
                },
                {
                  status: InvoiceStatus.SUBMITTED,
                  adminNote: body.adminNote,
                  processedAt: new Date(),
                  processedBy: admin.id,
                },
              );
              if (resInvoice.affected == 0)
                throw new InternalServerErrorException('Invoice failed!');

              //2)TRANSACTION:
              const newTransaction = manager.create(Transaction, {
                processedBy: admin.id,
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

              //3)Wallet:
              let walletNewBalance = 0;
              if (existInvoice.type === TransactionType.DEPOSIT) {
                walletNewBalance = new Decimal(existInvoice.wallet.balance)
                  .plus(existInvoice.totalAmount)
                  .toNumber();
              } else if (existInvoice.type === TransactionType.WITHDRAWAL) {
                if (
                  new Decimal(existInvoice.totalAmount).greaterThan(
                    new Decimal(existInvoice.wallet.balance),
                  )
                ) {
                  throw new ForbiddenException(
                    `amount of invoice <totalAmount:${existInvoice.totalAmount}> is greater than <wallet balance:${existInvoice.wallet.balance}>!`,
                  );
                }
                walletNewBalance = new Decimal(existInvoice.wallet.balance)
                  .minus(existInvoice.totalAmount)
                  .toNumber();
              }

              const resWllet = await manager.update(
                Wallet,
                { id: existInvoice.wallet.id },
                {
                  balance: walletNewBalance,
                },
              );
              if (resWllet.affected == 0)
                throw new InternalServerErrorException('Wallet failed!');

              //send message...
              // //to invoicer..
              await this.emailProducer.addInstanceEmailQueueJob({
                userEmail: existInvoice.user.email,
                type: existInvoice.type,
                amount: existInvoice.totalAmount,

                title: newTransaction.title,
                description: newTransaction.description || '-',
                fee: newTransaction.fee,
                netAmount: newTransaction.netAmount,
                invoiceNumber: existInvoice.invoiceNumber,
                //Done=>insert admin by cookie
                processedBy: admin.email,
                processDescription: existInvoice.adminNote,
                walletId: newTransaction.wallet.id,
                status: InvoiceStatus.SUBMITTED,
              });
              //to parent of invoicer (if exist):
              if (existInvoice.user.parent && existInvoice.user.parent?.email) {
                await this.emailProducer.addInstanceEmailQueueJob({
                  parentEmail: existInvoice.user.parent.email,
                  type: existInvoice.type,
                  amount: existInvoice.totalAmount,
                });
              }
              return {
                success: true,
                status: 201,
                result: {
                  for: existInvoice.user.email,
                  transActionType: existInvoice.type,
                  transActionAmount: existInvoice.totalAmount,
                  transActionDate: new Date(),
                },
              };
            } catch (error) {
              throw new HttpException(
                {
                  success: false,
                  message: 'Submittion failed!',
                  details: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          });
        }
    }
  }
}
