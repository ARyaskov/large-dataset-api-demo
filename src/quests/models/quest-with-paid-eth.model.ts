import { ObjectType, Field, Float } from "@nestjs/graphql"
import { Quest } from "./quest.model"

@ObjectType()
export class QuestWithPaidEth extends Quest {
  @Field(() => Float)
  paidETH: number
}
