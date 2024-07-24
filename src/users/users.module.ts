import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersResolver } from "./users.resolver"
import { StorageModule } from "../storage/storage.module"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule, StorageModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver],
})
export class UsersModule {}
