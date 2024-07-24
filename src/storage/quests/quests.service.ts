import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { QuestCompletionEntity } from "../quest-completions/quest-completion.entity"
import { Repository } from "typeorm"
import { Quest } from "../../quests/models/quest.model"
import { QuestEntity } from "./quest.entity"
import { QuestWithCompletionCount } from "../../quests/models/quest-with-completion-count.model"
import { QuestWithPaidEth } from "../../quests/models/quest-with-paid-eth.model"

@Injectable()
export class QuestsStorageService {
  constructor(
    @InjectRepository(QuestEntity)
    private questRepository: Repository<QuestEntity>,
    @InjectRepository(QuestCompletionEntity)
    private readonly questCompletionsRepository: Repository<QuestCompletionEntity>,
  ) {}

  async getMostPopularQuests(
    limit: number = 10,
  ): Promise<QuestWithCompletionCount[]> {
    return await this.questRepository
      .createQueryBuilder("q")
      .select([
        "q.id AS id",
        "q.name AS name",
        "q.eth_reward AS eth_reward",
        "COALESCE(qc.completion_count, 0) AS completion_count",
      ])
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select("quest_id")
            .addSelect("COUNT(*) AS completion_count")
            .from(QuestCompletionEntity, "qc")
            .groupBy("quest_id")
        },
        "qc",
        "qc.quest_id = q.id",
      )
      .orderBy("completion_count", "DESC")
      .addOrderBy("q.id", "ASC")
      .limit(limit)
      .getRawMany<QuestWithCompletionCount>()
  }

  async getTopPayingQuests(limit: number = 10): Promise<QuestWithPaidEth[]> {
    return await this.questRepository
      .createQueryBuilder("q")
      .select([
        "q.id AS id",
        "q.name AS name",
        "q.eth_reward AS eth_reward",
        "COALESCE(qc.completion_count, 0) AS completion_count",
        "COALESCE(qc.total_paid_eth, 0) AS paid_eth",
      ])
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select("quest_id")
            .addSelect("COUNT(*) AS completion_count")
            .addSelect("SUM(q.eth_reward) AS total_paid_eth")
            .from(QuestCompletionEntity, "qc")
            .innerJoin("qc.quest", "q")
            .groupBy("quest_id")
        },
        "qc",
        "qc.quest_id = q.id",
      )
      .orderBy("paid_eth", "DESC")
      .addOrderBy("q.id", "ASC")
      .limit(limit)
      .getRawMany<QuestWithPaidEth>()
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
