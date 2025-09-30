import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailProducer } from './producers/email.producer';
import { QueueEnum } from './enums/queue.enum';
import { MailModule } from 'src/mailer/mail.module';
import { DailyEmailConsumer } from './consumers/daily-email.consumer';
import { InstanceEmailConsumer } from './consumers/instance-email.consumer';

@Module({
  exports: [EmailProducer],
  providers: [EmailProducer, DailyEmailConsumer, InstanceEmailConsumer],
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      }),
    }),
    BullModule.registerQueue({
      name: QueueEnum.BATCH_EMAIL_QUEUE,
    }),
    BullModule.registerQueue({
      name: QueueEnum.INSTANCE_EMAIL_QUEUE,
    }),
    MailModule,
  ],
})
export class QueueModule {}
