import { Module } from "@nestjs/common"
import { QuestsService } from "./quests.service"
import { QuestsResolver } from "./quests.resolver"
import { StorageModule } from "../storage/storage.module"

@Module({
  imports: [StorageModule],
  providers: [QuestsService, QuestsResolver],
  exports: [QuestsService, QuestsResolver],
})
export class QuestsModule {}
