import { Controller, Get } from '@nestjs/common';
import { WalletUseCase } from '../use-cases/wallet.use-case';

@Controller('/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletUseCase) {}

  @Get('/')
  async getWallet(): Promise<any> {
    return await this.walletService.getWalletData(1);
  }
}
