import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [ScheduleModule.forRoot({}), TransactionModule, QueueModule],
  providers: [JobService],
})
export class JobModule {}
