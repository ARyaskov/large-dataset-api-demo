import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"

const isProduction = process.env.NODE_ENV === "production"

export const storageProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: "postgres",
      host: configService.get("POSTGRES_HOST"),
      port: configService.get("POSTGRES_PORT"),
      username: configService.get("POSTGRES_USER"),
      password: configService.get("POSTGRES_PASSWORD"),
      database: configService.get("POSTGRES_DB"),
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      migrationsRun: true,
      migrations: [__dirname + "/**/migrations/*.js"],
      logging: !isProduction ? ["query", "error"] : [],
      parseInt8: true,
    }),
    inject: [ConfigService],
  }),
]
