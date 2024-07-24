import { Resolver, Query } from "@nestjs/graphql"
import { QuestsService } from "./quests.service"
import { Quest } from "./models/quest.model"
import { QuestWithCompletionCount } from "./models/quest-with-completion-count.model"
import { QuestWithPaidEth } from "./models/quest-with-paid-eth.model"

@Resolver(() => Quest)
export class QuestsResolver {
  constructor(private questsService: QuestsService) {}

  @Query(() => [QuestWithCompletionCount])
  async mostPopularQuests(): Promise<QuestWithCompletionCount[]> {
    return await this.questsService.getMostPopularQuests()
  }

  @Query(() => [QuestWithPaidEth])
  async topPayingQuests(): Promise<QuestWithPaidEth[]> {
    return await this.questsService.getTopPayingQuests()
  }
}
