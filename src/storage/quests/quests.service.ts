import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { QuestCompletionEntity } from "../quest-completions/quest-completion.entity"
import { Repository } from "typeorm"

@Injectable()
export class QuestsStorageService {
  constructor(
    @InjectRepository(QuestCompletionEntity)
    private readonly questCompletionsRepository: Repository<QuestCompletionEntity>,
  ) {}

  getMostPopularQuests(limit: number = 10) {
    return this.questCompletionsRepository
      .createQueryBuilder("qc")
      .select("qc.quest_id, COUNT(qc.id) as completion_count")
      .groupBy("qc.quest_id")
      .orderBy("completion_count", "DESC")
      .limit(limit)
      .getRawMany()
  }

  getTopPayingQuests(limit: number = 10) {
    return this.questCompletionsRepository
      .createQueryBuilder("qc")
      .innerJoin("qc.quest", "q")
      .select("qc.quest_id, SUM(q.eth_reward) as total_eth")
      .groupBy("qc.quest_id")
      .orderBy("total_eth", "DESC")
      .limit(limit)
      .getRawMany()
  }

  async getTotalRewardForUser(userId: bigint) {
    const { total_eth } = await this.questCompletionsRepository
      .createQueryBuilder("qc")
      .innerJoin("qc.quest", "q")
      .select("SUM(q.eth_reward) as total_eth")
      .where("qc.user_id = :userId", { userId })
      .getRawOne()
    return total_eth
  }
}
