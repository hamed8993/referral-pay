import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailProducer } from './producers/email.producer';
import { QueueEnum } from './enums/queue.enum';

@Module({
  exports: [EmailProducer],
  providers: [EmailProducer],
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
      name: QueueEnum.EMAIL_QUEUE,
    }),
  ],
})
export class QueueModule {}
