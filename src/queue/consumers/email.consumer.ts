import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueEnum } from '../enums/queue.enum';
import { Job } from 'bullmq';

@Processor(QueueEnum.EMAIL_QUEUE)
export class EmailConsumer extends WorkerHost {
  process(job: Job, token?: string): Promise<any> | any {
    console.log('jobbinG=>', job.data);
  }
}
