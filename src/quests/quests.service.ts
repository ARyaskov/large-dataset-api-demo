import { Inject, Injectable } from "@nestjs/common"
import { QuestsStorageService } from "../storage/quests/quests.service"
import { QuestWithCompletionCount } from "./models/quest-with-completion-count.model"

@Injectable()
export class QuestsService {
  constructor(
    @Inject(QuestsStorageService)
    private questsStorageService: QuestsStorageService,
  ) {}

  async getMostPopularQuests(): Promise<QuestWithCompletionCount[]> {
    const res = await this.questsStorageService.getMostPopularQuests()
    return res.map((e) => ({
      ...e,
      eth_reward: BigInt(BigInt(e.eth_reward) / 10n ** 18n),
    }))
  }

  async getTopPayingQuests() {
    return await this.questsStorageService.getTopPayingQuests()
  }
}
