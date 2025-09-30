import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import {
  IDailyTranactionsReportItem,
  IInstanceTranactionOwnerReportItem,
  IInstanceTranactionParentReportItem,
} from 'src/common/interface/transaction-report.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendDailyTransactionsReport(data: IDailyTranactionsReportItem[]) {
    data.forEach(async (item) => {
      const totalBalance = item.transactions.reduce((sum, transaction) => {
        if (transaction.type === TransactionType.WITHDRAWAL) {
          return sum - Number(transaction.amount);
        } else if (transaction.type === TransactionType.DEPOSIT) {
          return sum + Number(transaction.amount);
        }
        return sum;
      }, 0);

      await this.mailerService.sendMail({
        to: item.parent.email,
        subject: `گزارش تراکنش‌های روزانه - ${new Date().toLocaleDateString('fa-IR')}`,
        template: './daily-transactions-report', // نام فایل تمپلیت
        context: {
          // داده‌های قابل استفاده در تمپلیت
          transactions: item.transactions.map((t) => ({
            type: t.type,
            amount: t.amount,
          })),
          date: new Date().toLocaleDateString('fa-IR'),
          netAmount: totalBalance,
        },
      });
    });
  }

  async sendInstanceTransactionOwnerReport(
    data: IInstanceTranactionOwnerReportItem,
  ) {
    await this.mailerService.sendMail({
      to: data.userEmail,
      subject: `گزارش تراکنش‌ - ${new Date().toLocaleDateString('fa-IR')}`,
      template: './instance-owner-transaction-report', // نام فایل تمپلیت
      context: {
        date: new Date().toLocaleDateString('fa-IR'),
        title: data.title,
        type: data.type,
        amount: data.amount,
        fee: data.fee,
        netAmount: data.netAmount,
        description: data.description,
        processedBy: data.processedBy,
        status: data.status,
        processDescription: data.processDescription,
        walletId: data.walletId,
        invoiceNumber: data.invoiceNumber,
      },
    });
  }

  async sendInstanceTransactionParentReport(
    data: IInstanceTranactionParentReportItem,
  ) {
    await this.mailerService.sendMail({
      to: data.parentEmail,
      subject: `گزارش تراکنش‌ - ${new Date().toLocaleDateString('fa-IR')}`,
      template: './instance-parent-transaction-report', // نام فایل تمپلیت
      context: {
        date: new Date().toLocaleDateString('fa-IR'),
        type: data.type,
        amount: data.amount,
      },
    });
  }
}
