import { ObjectType, Field, ID, Int } from "@nestjs/graphql"
import { Quest } from "./quest.model"

@ObjectType()
export class QuestWithCompletionCount extends Quest {
  @Field(() => Int)
  completionCount: number
}
