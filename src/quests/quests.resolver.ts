import { Resolver, Query } from "@nestjs/graphql"
import { QuestsService } from "./quests.service"
import { Quest } from "./models/quest.model"

@Resolver(() => Quest)
export class QuestsResolver {
  constructor(private questsService: QuestsService) {}

  @Query(() => [Quest])
  async mostPopularQuests(): Promise<Quest[]> {
    return this.questsService.getMostPopularQuests()
  }

  @Query(() => [Quest])
  async topPayingQuests(): Promise<Quest[]> {
    return this.questsService.getTopPayingQuests()
  }
}
