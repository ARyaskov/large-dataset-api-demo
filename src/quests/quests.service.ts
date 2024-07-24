import { Inject, Injectable } from "@nestjs/common"
import { QuestsStorageService } from "../storage/quests/quests.service"
import { QuestWithCompletionCount } from "./models/quest-with-completion-count.model"
import { QuestWithPaidEth } from "./models/quest-with-paid-eth.model"

@Injectable()
export class QuestsService {
  constructor(
    @Inject(QuestsStorageService)
    private questsStorageService: QuestsStorageService,
  ) {}

  async getMostPopularQuests(): Promise<QuestWithCompletionCount[]> {
    const res = await this.questsStorageService.getMostPopularQuests()
    return res.map((e: any) => ({
      ...e,
      eth_reward: BigInt((BigInt(e.eth_reward) * 100n) / 10n ** 18n) / 100n,
      completionCount: e.completion_count,
    }))
  }

  async getTopPayingQuests(): Promise<QuestWithPaidEth[]> {
    const res = await this.questsStorageService.getTopPayingQuests()

    return res.map((e: any) => ({
      ...e,
      paidETH: Number(BigInt((BigInt(e.paid_eth) * 100n) / 10n ** 18n) / 100n),
    }))
  }
}
