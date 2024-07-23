import { ObjectType, Field, ID, Int } from "@nestjs/graphql"
import { GraphQLBigInt } from "graphql-scalars"

@ObjectType()
export class Quest {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field(() => GraphQLBigInt)
  eth_reward: bigint
}
