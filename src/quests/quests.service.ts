import { Inject, Injectable } from "@nestjs/common"
import { QuestsStorageService } from "../storage/quests/quests.service"
import axios from "axios"

@Injectable()
export class QuestsService {
  constructor(
    @Inject(QuestsStorageService)
    private questsStorageService: QuestsStorageService,
  ) {}

  async getMostPopularQuests() {
    return this.questsStorageService.getMostPopularQuests()
  }

  async getTopPayingQuests() {
    return this.questsStorageService.getTopPayingQuests()
  }

  async getTotalRewardInUSDForUser(userId: number) {}

  private async getEthPriceOnDate(date: Date): Promise<number> {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${date.toISOString().split("T")[0]}`,
    )
    return response.data.market_data.current_price.usd
  }
}
