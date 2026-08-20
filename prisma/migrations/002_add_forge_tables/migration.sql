-- Forge Pages
CREATE TABLE "forge_pages" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "forge_project_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "forge_pages_forge_project_id_fkey" FOREIGN KEY ("forge_project_id") REFERENCES "ForgeProject" ("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "forge_pages_forge_project_id_slug_key" ON "forge_pages"("forge_project_id", "slug");
CREATE INDEX "forge_pages_forge_project_id_idx" ON "forge_pages"("forge_project_id");
