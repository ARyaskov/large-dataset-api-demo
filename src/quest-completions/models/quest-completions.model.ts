import { ObjectType, Field, ID } from "@nestjs/graphql"
import { User } from "../../users/models/user.model"
import { Quest } from "../../quests/models/quest.model"

@ObjectType()
export class QuestCompletion {
  @Field(() => ID)
  id: string

  @Field(() => User)
  user: User

  @Field(() => Quest)
  quest: Quest

  @Field()
  completed_at: string
}
