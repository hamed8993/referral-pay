import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueEnum } from '../enums/queue.enum';
import { MailService } from 'src/mailer/mail.service';
import { Job } from 'bullmq';

@Processor(QueueEnum.INSTANCE_EMAIL_QUEUE)
export class InstanceEmailConsumer extends WorkerHost {
  constructor(private mailService: MailService) {
    super();
  }
  process(job: Job<any>, token?: string): Promise<any> | any {
    if (job.data.userEmail) {
      this.mailService.sendInstanceTransactionOwnerReport(job.data);
    } else if (job.data.parentEmail) {
      this.mailService.sendInstanceTransactionParentReport(job.data);
    }
  }
}
