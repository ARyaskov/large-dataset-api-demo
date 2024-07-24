import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("quests")
export class QuestEntity {
  @PrimaryGeneratedColumn()
  id: bigint

  @Column()
  name: string

  @Column({ type: "bigint" })
  eth_reward: bigint
}
