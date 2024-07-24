import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { storageProviders } from "./storage.providers"
import { UserEntity } from "./users/user.entity"
import { QuestEntity } from "./quests/quest.entity"
import { QuestCompletionEntity } from "./quest-completions/quest-completion.entity"
import { QuestsStorageService } from "./quests/quests.service"
import { QuestCompletionsStorageService } from "./quest-completions/quest-completions.service"

@Module({
  imports: [
    ...storageProviders,
    TypeOrmModule.forFeature([UserEntity, QuestEntity, QuestCompletionEntity]),
  ],
  providers: [QuestsStorageService, QuestCompletionsStorageService],
  exports: [QuestsStorageService, QuestCompletionsStorageService],
})
export class StorageModule {}
