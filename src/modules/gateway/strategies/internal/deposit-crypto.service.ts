import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { ValidatedJwtUser } from 'src/modules/auth/interfaces/payload.interface';
import { InvoiceService } from 'src/modules/invoice/invoice.service';
import { ITransfer } from 'src/modules/transfer/interface/transfer.interface';
import { WalletService } from 'src/modules/wallet/wallet.service';

@Injectable()
export class DepositCryptoService {
  constructor(
    private invoiceService: InvoiceService,
    private walletService: WalletService,
  ) {}

  async depostCryptoWallet(
    body: ITransfer,
    user: ValidatedJwtUser,
    gatewayId: string,
  ): Promise<any> {
    //PAYLOAD=>amount,depositWalletId, network
    const payload: Pick<
      ITransfer,
      'cryptoDepositNetwork' | 'cryptoDepositWalletId' | 'amount'
    > = {
      cryptoDepositNetwork: body.cryptoDepositNetwork,
      cryptoDepositWalletId: body.cryptoDepositWalletId,
      amount: body.amount,
    };
    //1)check if depositWallet exist and check if depositWallet is for this user:
    const depositWalletForThisUserId =
      await this.walletService.findOneByIdForThisUserId(
        +(payload.cryptoDepositWalletId as string),
        user.id,
      );

    if (!depositWalletForThisUserId)
      throw new BadRequestException(
        'such a wallet not found OR this wallet is not belong to you!!',
      );
    //create invoice
    const savedInvoice = await this.invoiceService.createInvoice({
      paymentGatewayId: gatewayId,
      type: TransactionType.DEPOSIT,
      title: 'localized-title???',
      description: 'localized-desc',
      subtotal: payload.amount,
      tax: 0, //??
      discount: 0, //?
      user: depositWalletForThisUserId.user,
      toWallet: depositWalletForThisUserId,
      cryptoNetwork: payload.cryptoDepositNetwork,
    });
    //=>return address + tracing code
    return {
      currency: depositWalletForThisUserId.type,
      network: savedInvoice.cryptoNetwork,
      tracingCode: savedInvoice.invoiceNumber,
      amount: savedInvoice.subtotal,
      tax: savedInvoice.tax,
      discount: savedInvoice.discount,
      neAmount: savedInvoice._totalAmount,
      walletAddressForDeposit: '???????????????????????????',
    };
    //Todo: in after, will ad doc of deposit
  }
}
