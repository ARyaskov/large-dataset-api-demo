#!/bin/bash
set -e

echo "Creating user and database if they do not exist..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  DO
  \$do\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$POSTGRES_USER') THEN
      CREATE ROLE $POSTGRES_USER WITH LOGIN PASSWORD '$POSTGRES_PASSWORD';
    ELSE
      RAISE NOTICE 'Role $POSTGRES_USER already exists. Skipping creation.';
      ALTER USER $POSTGRES_USER PASSWORD '$POSTGRES_PASSWORD';
    END IF;
  END
  \$do\$;

  SELECT 'CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$POSTGRES_DB')\gexec

  GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
EOSQL

echo "User and database creation script completed."
