import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { IDailyTranactionsReportItem } from 'src/common/interface/transaction-report.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async getAllLastOneDayRecords(): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return await this.transactionRepo.find({
      where: {
        created_at: Between(startOfDay, endOfDay),
        user: {
          parent: Not(IsNull()),
        },
      },
      //   relations: ['user', 'user.parent'], // لود کردن روابط
      relations: {
        user: {
          parent: true,
        },
      },
    });
  }

  async getAllRecordsByParent(): Promise<IDailyTranactionsReportItem[]> {
    const transactions = await this.getAllLastOneDayRecords();

    const report: Record<number, any> = {};

    for (const tx of transactions) {
      const parentId = tx.user.parent.id;

      if (!report[parentId]) {
        report[parentId] = {
          parent: {
            email: tx.user.parent.email,
          },
          transactions: [],
        };
      }

      report[parentId].transactions.push({
        type: tx.type,
        amount: tx.amount,
      });
    }

    // return JSON.stringify(Object.values(report));
    return Object.values(report);
  }
}

// [
//   {
//     "parent": {
//       "email": 'parent@gmail.com',
//     },
//     "transactions": [
//       {
//         "type": 'deposite',
//         "amount": '200.00',
//       },
//       {
//         "type": 'withdrawal',
//         "amount": '250.01',
//       },
//       ...
//     ],
//   },
// ];
