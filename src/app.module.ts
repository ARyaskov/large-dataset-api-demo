import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius"
import { ConfigModule } from "@nestjs/config"
import * as Joi from "joi"
import { StorageModule } from "./storage/storage.module"

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
      driver: MercuriusDriver,
      debug: true,
      graphiql: true,
      path: "/api/v0/graphql",
    }),
    StorageModule,
  ],
})
export class AppModule {}
