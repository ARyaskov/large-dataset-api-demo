import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { QuestCompletionEntity } from "./quest-completion.entity"
import { Repository } from "typeorm"

@Injectable()
export class QuestCompletionsStorageService {
  constructor(
    @InjectRepository(QuestCompletionEntity)
    private readonly questCompletionRepository: Repository<QuestCompletionEntity>,
  ) {}

  async getTotalETHRewardForUser(userId: bigint): Promise<bigint> {
    const result = await this.questCompletionRepository
      .createQueryBuilder("qc")
      .select("SUM(q.eth_reward)", "totalReward")
      .innerJoin("qc.quest", "q")
      .where("qc.user_id = :userId", { userId })
      .getRawOne()

    return BigInt(result.totalReward || 0)
  }
}
