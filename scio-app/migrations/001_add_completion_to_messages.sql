-- Add completion column to group_messages table
ALTER TABLE group_messages
ADD COLUMN completion INTEGER DEFAULT NULL;

-- Add a check constraint to ensure completion is between 0 and 100
ALTER TABLE group_messages
ADD CONSTRAINT check_completion_range 
CHECK (completion IS NULL OR (completion >= 0 AND completion <= 100));

-- Add an index on completion for faster queries
CREATE INDEX idx_group_messages_completion 
ON group_messages(completion) 
WHERE completion IS NOT NULL;