import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class QuestEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  eth_reward: number
}
