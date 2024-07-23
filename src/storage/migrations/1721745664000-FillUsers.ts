import { MigrationInterface, QueryRunner } from "typeorm"

export class FillUsers1721745664000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Function to seed users table
            CREATE OR REPLACE FUNCTION seed_users() RETURNS void AS $$
            DECLARE
                user_count INTEGER;
            BEGIN
                -- Check if the users table is empty
                SELECT COUNT(*) INTO user_count FROM users;
                
                IF user_count = 0 THEN
                    -- Generate 2 million user records
                    INSERT INTO users (id, username)
                    SELECT 
                        id,
                        'user' || id::text || '.eth' AS username
                    FROM generate_series(1, 2000000) AS id;
                    
                    -- Reset the sequence to the max id
                    PERFORM setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
                    
                    RAISE NOTICE 'Inserted 2 million records into the users table.';
                ELSE
                    RAISE NOTICE 'Users table is not empty. Skipping seeding process.';
                END IF;
            END;
            $$ LANGUAGE plpgsql;

            -- Execute the function
            SELECT seed_users();

            -- Drop the function after use
            DROP FUNCTION seed_users();
        `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
