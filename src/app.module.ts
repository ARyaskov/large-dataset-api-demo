import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius"
import { ConfigModule } from "@nestjs/config"
import * as Joi from "joi"
import { StorageModule } from "./storage/storage.module"
import { BigIntResolver } from "graphql-scalars"
import { QuestsModule } from "./quests/quests.module"
import { join } from "path"
import { UsersModule } from "./users/users.module"

const isProduction = process.env.NODE_ENV === "production"

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        HOST: Joi.string().default("localhost"),
        PORT: Joi.number().default(3030),
        POSTGRES_HOST: Joi.string().default("localhost"),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string().default("large_dataset_api_demo"),
        POSTGRES_PASSWORD: Joi.string().allow("").optional(),
        POSTGRES_DB: Joi.string().default("large_dataset_api_demo"),
      }),
      isGlobal: true,
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      autoSchemaFile: isProduction ? false : join(process.cwd(), "schema.graphql"),
      driver: MercuriusDriver,
      debug: !isProduction,
      graphiql: !isProduction,
      path: "/api/v0/graphql",
      resolvers: { BigInt: BigIntResolver },
    }),
    StorageModule,
    QuestsModule,
    UsersModule,
  ],
})
export class AppModule {}
