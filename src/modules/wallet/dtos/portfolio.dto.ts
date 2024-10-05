import { AssetDTO } from './asset.dto';

export class PortfolioDTO {
  total_balance: number;
  available_cash: number;
  assets: AssetDTO[];
}
