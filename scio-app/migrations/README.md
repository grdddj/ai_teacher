# Database Migrations

## Running Migrations

To apply migrations to your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file
4. Run the SQL command

## Migration: 001_add_completion_to_messages.sql

This migration adds goal completion tracking to the messages table:

- Adds `completion` column (INTEGER, nullable) to store completion percentage (0-100)
- Adds check constraint to ensure values are between 0 and 100
- Creates index for faster queries on completion values

The `completion` field is:

- `NULL` for regular user messages
- `0-100` for system evaluation messages that track goal progress

## Migration: 002_add_source_to_messages.sql

This migration adds message source tracking to distinguish between user and system messages:

- Adds `source` column (VARCHAR(10), not null, default 'user')
- Adds check constraint to ensure values are either 'user' or 'system'
- Creates index for faster filtering by source
- Updates existing evaluation messages (with completion NOT NULL) to have source='system'

The `source` field helps distinguish:

- `'user'` for messages sent by students
- `'system'` for AI evaluation messages and system notifications
