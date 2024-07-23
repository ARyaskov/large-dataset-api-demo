import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { storageProviders } from "./storage.providers"
import { UserEntity } from "./users/users.entity"

@Module({
  imports: [...storageProviders, TypeOrmModule.forFeature([UserEntity])],
  providers: [],
  exports: [],
})
export class StorageModule {}
