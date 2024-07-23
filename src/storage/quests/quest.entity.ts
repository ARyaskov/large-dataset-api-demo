import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class QuestEntity {
  @PrimaryGeneratedColumn()
  id: bigint

  @Column()
  name: string

  @Column()
  eth_reward: bigint
}
