import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string
}
