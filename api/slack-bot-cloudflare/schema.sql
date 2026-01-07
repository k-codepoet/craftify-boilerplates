-- Slack Bot D1 Schema
-- Run with: pnpm db:init (local) or pnpm db:init:remote (production)

-- Example: Documents table (customize for your use case)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  content TEXT,
  slack_channel_id TEXT NOT NULL,
  slack_file_id TEXT,
  slack_thread_ts TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Example: Messages table for storing conversation context
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id TEXT,
  slack_user_id TEXT NOT NULL,
  slack_user_name TEXT,
  message_text TEXT NOT NULL,
  message_ts TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_documents_slack_file ON documents(slack_file_id);
CREATE INDEX IF NOT EXISTS idx_documents_channel ON documents(slack_channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_doc ON messages(document_id);
