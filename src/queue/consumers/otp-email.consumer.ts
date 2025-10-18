import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueEnum } from '../enums/queue.enum';
import { MailService } from 'src/mailer/mail.service';
import { Job } from 'bullmq';
import { IOtpMessage } from '../interface/otp-message.interface';

@Processor(QueueEnum.OTP_QUEUE)
export class OtpEmailConsumer extends WorkerHost {
  constructor(private mailService: MailService) {
    super();
  }

  async process(job: Job<IOtpMessage>, token?: string): Promise<any> {
    return await this.mailService.sendOtp({
      emailAddress: job.data.sendTo,
      otpCode: job.data.code,
      fullName: job.data.fullName,
      title: job.data.title,
    });
  }
}
