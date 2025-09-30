import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailProducer } from 'src/queue/producers/email.producer';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class JobService {
  constructor(
    private TransactionService: TransactionService,
    private emailProducer: EmailProducer,
  ) {}

  @Cron('01 00 * * *')
  async handleSendDailyReportEmail(): Promise<any> {
    const res = await this.TransactionService.getAllRecordsByParent();

    await this.emailProducer.addBatchEmailsJob(res);
    // this.mailService.sendDailyTransactionsReport(res);
    // [
    //   {
    //     parent: { email: 'hamed7087@gmail.com' },
    //     transactions: [{ type: 'withdrawal', amount: '100.00' }],
    //   },
    // ];
  }
}
