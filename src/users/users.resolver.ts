import { Resolver, Query, Float, Args, Int } from "@nestjs/graphql"
import { User } from "./models/user.model"
import { UsersService } from "./users.service"
import { GraphQLBigInt } from "graphql-scalars"

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => Float)
  async getTotalRewardETHForUser(
    @Args("id", { type: () => GraphQLBigInt }) userId: bigint,
  ): Promise<number> {
    return await this.usersService.getTotalETHRewardForUser(userId)
  }

  @Query(() => Float)
  async getTotalRewardUSDForUser(
    @Args("id", { type: () => GraphQLBigInt }) userId: bigint,
  ): Promise<number> {
    return await this.usersService.getTotalUSDRewardForUser(userId)
  }
}
