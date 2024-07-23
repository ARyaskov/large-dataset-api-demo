import { MigrationInterface, QueryRunner } from "typeorm"

export class FillQuestCompletions1721745666000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     -- Function to seed quest_completions table
      CREATE OR REPLACE FUNCTION seed_quest_completions() RETURNS void AS $$
      DECLARE
        completion_count INTEGER;
        quest_count INTEGER;
        user_count INTEGER;
      BEGIN
        -- Check if the quest_completions table is empty
        SELECT COUNT(*) INTO completion_count FROM quest_completions;
        
        -- Check if quests and users tables have data
        SELECT COUNT(*) INTO quest_count FROM quests;
        SELECT COUNT(*) INTO user_count FROM users;
        
        IF completion_count = 0 AND quest_count > 0 AND user_count > 0 THEN
          -- Generate 2 million quest_completion records
          INSERT INTO quest_completions (id, user_id, quest_id, completed_at)
          SELECT 
            id,
            (random() * (user_count - 1) + 1)::int AS user_id,
            (random() * (quest_count - 1) + 1)::int AS quest_id,
            (timestamp '2023-01-01' + random() * (timestamp '2023-12-31' - timestamp '2023-01-01')) AS completed_at
          FROM generate_series(1, 2000000) AS id;
          
          -- Reset the sequence to the max id
          PERFORM setval(pg_get_serial_sequence('quest_completions', 'id'), (SELECT MAX(id) FROM quest_completions));
          
          RAISE NOTICE 'Inserted 2 million records into the quest_completions table.';
        ELSE
          IF completion_count > 0 THEN
            RAISE NOTICE 'Quest_completions table is not empty. Skipping seeding process.';
          ELSIF quest_count = 0 THEN
            RAISE EXCEPTION 'Quests table is empty. Please seed the quests table before running this migration.';
          ELSIF user_count = 0 THEN
            RAISE EXCEPTION 'Users table is empty. Please seed the users table before running this migration.';
          END IF;
        END IF;
      END;
      $$ LANGUAGE plpgsql;

      -- Execute the function
      SELECT seed_quest_completions();

      -- Drop the function after use
      DROP FUNCTION seed_quest_completions();
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
