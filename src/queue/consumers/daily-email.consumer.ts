import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueEnum } from '../enums/queue.enum';
import { Job } from 'bullmq';
import { MailService } from 'src/mailer/mail.service';
import {
  IDailyTranactionsReportItem,
} from 'src/common/interface/transaction-report.interface';

@Processor(QueueEnum.BATCH_EMAIL_QUEUE)
export class DailyEmailConsumer extends WorkerHost {
  constructor(private mailService: MailService) {
    super();
  }
  process(
    job: Job<IDailyTranactionsReportItem[]>,
    token?: string,
  ): Promise<any> | any {
    this.mailService.sendDailyTransactionsReport(job.data);
  }
}
