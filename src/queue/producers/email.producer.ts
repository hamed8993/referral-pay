import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueEnum } from '../enums/queue.enum';
import { MessageInterface } from '../interface/message.interface';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue(QueueEnum.EMAIL_QUEUE) private emailQueue: Queue) {}
  async addSendMail(message: MessageInterface) {
    console.log('QUEUE - message>>>>>>  IN EmailProducer >>>', message);
    const sendMailJob = await this.emailQueue.add(
      QueueEnum.SEND_MAIL_JOB,
      message,
    );
    return sendMailJob;
  }
}
