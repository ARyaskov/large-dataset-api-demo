import { MigrationInterface, QueryRunner } from "typeorm"

export class FillQuests1721745665000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Function to seed quests table
      CREATE OR REPLACE FUNCTION seed_quests() RETURNS void AS $$
      DECLARE
        quest_count INTEGER;
      BEGIN
        -- Check if the quests table is empty
        SELECT COUNT(*) INTO quest_count FROM quests;
        
        IF quest_count = 0 THEN
          -- Generate 3000 quest records
          INSERT INTO quests (id, name, eth_reward)
          SELECT 
            id,
            gen_random_uuid()::text AS name,
            (random() * (900000000000000000 - 1000000000000000) + 1000000000000000)::bigint AS eth_reward
          FROM generate_series(1, 3000) AS id;
          
          -- Reset the sequence to the max id
          PERFORM setval(pg_get_serial_sequence('quests', 'id'), (SELECT MAX(id) FROM quests));
          
          RAISE NOTICE 'Inserted 3000 records into the quests table.';
        ELSE
          RAISE NOTICE 'Quests table is not empty. Skipping seeding process.';
        END IF;
      END;
      $$ LANGUAGE plpgsql;

      -- Execute the function
      SELECT seed_quests();

      -- Drop the function after use
      DROP FUNCTION seed_quests();
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
