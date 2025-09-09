-- Add source column to group_messages table
ALTER TABLE group_messages
ADD COLUMN source VARCHAR(10) NOT NULL DEFAULT 'user';

-- Add a check constraint to ensure source is either 'user' or 'system'
ALTER TABLE group_messages
ADD CONSTRAINT check_message_source 
CHECK (source IN ('user', 'system'));

-- Add an index on source for faster filtering
CREATE INDEX idx_group_messages_source 
ON group_messages(source);

-- Update any existing messages to have source = 'user' (already handled by default)
-- Update system messages (those with completion NOT NULL) to have source = 'system'
UPDATE group_messages 
SET source = 'system' 
WHERE completion IS NOT NULL;