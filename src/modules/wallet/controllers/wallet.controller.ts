import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { WalletUseCase } from '../use-cases/wallet.use-case';
import { JwtAuthGuard } from '@modules/auth/guards/jwtauth.guard';
import { User } from '@modules/users/entities/user.entity';

@Controller('/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletUseCase) {}

  @Get('/')
  async getWallet(@Request() req: any): Promise<any> {
    const user: User = req.user;
    return await this.walletService.getWalletData(user.id);
  }
}
