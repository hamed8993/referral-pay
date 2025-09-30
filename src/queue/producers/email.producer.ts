import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueEnum } from '../enums/queue.enum';
import {
  IDailyTranactionsReportItem,
  IInstanceTranactionOwnerReportItem,
  IInstanceTranactionParentReportItem,
} from 'src/common/interface/transaction-report.interface';

@Injectable()
export class EmailProducer {
  constructor(
    @InjectQueue(QueueEnum.BATCH_EMAIL_QUEUE) private batchEmailsQueue: Queue,
    @InjectQueue(QueueEnum.INSTANCE_EMAIL_QUEUE)
    private instanceEmailQueue: Queue,
  ) {}
  async addBatchEmailsJob(message: IDailyTranactionsReportItem[]) {
    const sendMailJob = await this.batchEmailsQueue.add(
      QueueEnum.SEND_DAILY_MAIL_JOB,
      message,
    );
    return sendMailJob;
  }

  async addInstanceEmailQueueJob(
    message:
      | Partial<IInstanceTranactionOwnerReportItem>
      | Partial<IInstanceTranactionParentReportItem>,
  ) {
    const sendMailJob = await this.instanceEmailQueue.add(
      QueueEnum.SEND_INSTANCE_MAIL_JOB,
      message,
    );
    return sendMailJob;
  }

  // async addInstanceEmailQueueJob(message: IInstanceTranactionParentReportItem) {
  //   const sendMailJob = await this.instanceEmailQueue.add(
  //     QueueEnum.SEND_INSTANCE_MAIL_JOB,
  //     message,
  //   );
  //   return sendMailJob;
  // }
}
