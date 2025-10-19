import { FindOptionsWhere } from 'typeorm';
import { Invoice } from '../entity/invoice.entity';

export type InvoiceUpdatePayloadType = Partial<
  Pick<
    Invoice,
    | 'status'
    | 'processedAt'
    | 'processedBy'
    | 'adminNote'
    | 'userCancellDescription'
    | 'transaction'
    | 'depositDocUrl'
  >
>;

export type InvoiceRelationLoadType = ('user' | 'transaction' | 'fromWallet' | 'toWallet')[]