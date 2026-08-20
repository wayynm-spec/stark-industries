-- AI Conversations and Messages
CREATE TABLE "ai_conversations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "workspace_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ai_conversations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace" ("id") ON DELETE CASCADE,
  CONSTRAINT "ai_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile" ("id") ON DELETE CASCADE
);

CREATE TABLE "ai_messages" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "conversation_id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "provider" TEXT,
  "model" TEXT,
  "tool_calls" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "ai_conversations" ("id") ON DELETE CASCADE
);

CREATE INDEX "ai_conversations_workspace_id_idx" ON "ai_conversations"("workspace_id");
CREATE INDEX "ai_conversations_user_id_idx" ON "ai_conversations"("user_id");
CREATE INDEX "ai_messages_conversation_id_idx" ON "ai_messages"("conversation_id");
