import { Inject, Injectable } from "@nestjs/common"
import axios from "axios"
import { ConfigService } from "@nestjs/config"
import { DateTime } from "luxon"
import { QuestCompletionsStorageService } from "../storage/quest-completions/quest-completions.service"

@Injectable()
export class UsersService {
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject(QuestCompletionsStorageService)
    private questCompletionsStorageService: QuestCompletionsStorageService,
  ) {}

  async getTotalETHRewardForUser(userId: bigint): Promise<number> {
    const rewardInWei =
      await this.questCompletionsStorageService.getTotalETHRewardForUser(userId)

    return Number((rewardInWei * 100n) / 10n ** 18n) / 100
  }

  async getTotalUSDRewardForUser(userId: bigint): Promise<number> {
    const completions =
      await this.questCompletionsStorageService.byUserId(userId)
    let totalUsdReward = 0

    for (const completion of completions) {
      const ethPrice = await this.getEthPriceOnDate(completion.completed_at)
      const usdReward =
        Number(
          Number((BigInt(completion.quest.eth_reward) * 100n) / 10n ** 18n) /
            100,
        ) * ethPrice
      totalUsdReward += usdReward
    }

    return Number(totalUsdReward.toFixed(2))
  }

  private async getEthPriceOnDate(date: Date): Promise<number> {
    let price = 0
    const then = DateTime.fromJSDate(date)
    const query = `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${then.toFormat(
      "dd-MM-yyyy",
    )}`

    const response = await axios
      .get(query, {
        headers: {
          "x-cg-demo-api-key":
            this.configService.get<string>("COINGECKO_API_KEY"),
        },
      })
      .catch((e) => {
        console.debug(e.message)
        console.debug(JSON.stringify(e.response.data))
        throw e
      })
    if (response.data) {
      price = response.data.market_data.current_price.usd
    }
    return price
  }
}
