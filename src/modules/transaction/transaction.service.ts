import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Between, EntityManager, IsNull, Not, Repository } from 'typeorm';
import { IDailyTranactionsReportItem } from 'src/common/interface/transaction-report.interface';
import { ICreateTransaction } from './interface/create-transaction.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async createTransactionByManager(
    manager: EntityManager,
    body: ICreateTransaction,
  ): Promise<any> {
    return await manager.save(Transaction, body);
  }

  async getAllLastOneDayRecords(): Promise<any> {
    const now = new Date();

    // امروز ۰۰:۰۰:۰۰
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // دیروز ۰۰:۰۰:۰۰
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    return await this.transactionRepo.find({
      where: {
        created_at: Between(startOfYesterday, startOfToday),
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
