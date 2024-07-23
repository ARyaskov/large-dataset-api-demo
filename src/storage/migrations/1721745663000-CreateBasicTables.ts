import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateBasicTables1721745663000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" BIGSERIAL PRIMARY KEY,
                "username" VARCHAR(255) UNIQUE NOT NULL
            )
        `)

    await queryRunner.query(`
            CREATE INDEX "idx_users_username" ON "users" ("username")
        `)

    await queryRunner.query(`
            CREATE TABLE "quests" (
                "id" BIGSERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "eth_reward" BIGINT NOT NULL,
                CONSTRAINT "check_eth_reward_non_negative" CHECK ("eth_reward" >= 0)
            )
        `)

    await queryRunner.query(`
            CREATE INDEX "idx_quests_name" ON "quests" ("name")
        `)

    await queryRunner.query(`
            COMMENT ON COLUMN "quests"."eth_reward" IS 'ETH reward amount in wei (1 ETH = 10^18 wei)'
        `)

    await queryRunner.query(`
            CREATE TABLE "quest_completions" (
                "id" BIGSERIAL PRIMARY KEY,
                "user_id" BIGINT NOT NULL,
                "quest_id" BIGINT NOT NULL,
                "completed_at" TIMESTAMP NOT NULL,
                CONSTRAINT "fk_user"
                    FOREIGN KEY ("user_id") 
                    REFERENCES "users" ("id") 
                    ON DELETE CASCADE,
                CONSTRAINT "fk_quest"
                    FOREIGN KEY ("quest_id") 
                    REFERENCES "quests" ("id") 
                    ON DELETE CASCADE
            )
        `)

    await queryRunner.query(`
            CREATE INDEX "idx_user_quest" ON "quest_completions" ("user_id", "quest_id")
        `)
    await queryRunner.query(`
            CREATE INDEX "idx_quest_completions_completed_at" ON "quest_completions" ("completed_at")
        `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_users_username"`)
    await queryRunner.query(`DROP INDEX "idx_quests_name"`)
    await queryRunner.query(`DROP INDEX "idx_quest_completions_completed_at"`)
    await queryRunner.query(`DROP INDEX "idx_user_quest"`)
    await queryRunner.query(`DROP TABLE "quest_completions"`)
    await queryRunner.query(`DROP TABLE "quests"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
