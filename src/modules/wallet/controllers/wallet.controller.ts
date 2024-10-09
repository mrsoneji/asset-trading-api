import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { WalletUseCase } from '../use-cases/wallet.use-case';
import { JwtAuthGuard } from '@modules/auth/guards/jwtauth.guard';
import { User } from '@modules/users/entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletUseCase) {}

  @ApiResponse({
    status: 401,
    description:
      'JWT Bearer must to be provided or was formed using an incorrect secret',
  })
  @ApiResponse({
    status: 200,
    description:
      'Available cash, balance and sorted list of acquired orders by the user must be provided by the server',
  })
  @Get('/')
  async getWallet(@Request() req: any): Promise<any> {
    const user: User = req.user;
    return await this.walletService.getWalletData(user.id);
  }
}
