ALTER TABLE IF EXISTS "UserProfile" ADD COLUMN IF NOT EXISTS "id" TEXT;
ALTER TABLE IF EXISTS "UserProfile" ADD COLUMN IF NOT EXISTS "goalDirection" TEXT NOT NULL DEFAULT 'mantener';
ALTER TABLE IF EXISTS "UserProfile" ADD COLUMN IF NOT EXISTS "theme" TEXT DEFAULT 'theme-aquamarine';
ALTER TABLE IF EXISTS "UserProfile" ADD COLUMN IF NOT EXISTS "specialDish" JSONB;

UPDATE "UserProfile"
SET "id" = "userId"
WHERE "id" IS NULL OR "id" = '';

CREATE UNIQUE INDEX IF NOT EXISTS "UserProfile_id_key" ON "UserProfile"("id");
