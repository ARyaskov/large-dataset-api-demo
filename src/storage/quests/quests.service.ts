import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { QuestCompletionEntity } from "../quest-completions/quest-completion.entity"
import { Repository } from "typeorm"
import { Quest } from "../../quests/models/quest.model"
import { QuestEntity } from "./quest.entity"
import { QuestWithCompletionCount } from "../../quests/models/quest-with-completion-count.model"

@Injectable()
export class QuestsStorageService {
  constructor(
    @InjectRepository(QuestCompletionEntity)
    private readonly questCompletionsRepository: Repository<QuestCompletionEntity>,
  ) {}

  async getMostPopularQuests(
    limit: number = 10,
  ): Promise<QuestWithCompletionCount[]> {
    const rawResults = await this.questCompletionsRepository
      .createQueryBuilder("qc")
      .select([
        "q.id AS id",
        "q.name AS name",
        "q.eth_reward AS eth_reward",
        "COUNT(qc.id) AS completion_count",
      ])
      .innerJoin(QuestEntity, "q", "q.id = qc.quest_id")
      .groupBy("q.id")
      .orderBy("completion_count", "DESC")
      .limit(limit)
      .getRawMany<QuestWithCompletionCount>()

    return rawResults
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
