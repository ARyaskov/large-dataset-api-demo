import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { UserEntity } from "../users/user.entity"
import { QuestEntity } from "../quests/quest.entity"

@Entity()
export class QuestCompletionEntity {
  @PrimaryGeneratedColumn()
  id: bigint

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @ManyToOne(() => QuestEntity)
  @JoinColumn({ name: "quest_id" })
  quest: QuestEntity

  @Column()
  completed_at: Date
}
