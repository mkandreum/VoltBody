CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Session" (
  "token" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");

CREATE TABLE IF NOT EXISTS "UserSettings" (
  "userId" TEXT PRIMARY KEY,
  "theme" TEXT NOT NULL DEFAULT 'theme-aquamarine',
  "language" TEXT NOT NULL DEFAULT 'es',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "UserProfile" (
  "userId" TEXT PRIMARY KEY,
  "age" INTEGER,
  "weight" DOUBLE PRECISION,
  "height" DOUBLE PRECISION,
  "gender" TEXT,
  "goal" TEXT,
  "goalDirection" TEXT NOT NULL DEFAULT 'mantener',
  "goalTargetKg" DOUBLE PRECISION,
  "goalTimelineMonths" INTEGER,
  "currentState" TEXT,
  "schedule" TEXT,
  "trainingDaysPerWeek" INTEGER,
  "sessionMinutes" INTEGER,
  "workHours" INTEGER,
  "motivationPhrase" TEXT,
  "motivationPhoto" TEXT,
  "mealTimes" TEXT,
  "foodPreferences" TEXT,
  "weeklySpecialSession" TEXT,
  "specialDishName" TEXT,
  "specialDishCalories" INTEGER,
  "specialDishProteins" INTEGER,
  "specialDishCarbs" INTEGER,
  "specialDishFats" INTEGER,
  "specialDishPrep" TEXT,
  "avatarConfig" TEXT,
  "routine" TEXT,
  "diet" TEXT,
  "insights" TEXT,
  "profilePhoto" TEXT,
  "fitnessGoal" TEXT NOT NULL DEFAULT 'recomposicion',
  "activityLevel" TEXT NOT NULL DEFAULT 'moderado',
  "dailySteps" INTEGER NOT NULL DEFAULT 7000,
  "trainingPlace" TEXT NOT NULL DEFAULT 'gym',
  "trainTime" TEXT NOT NULL DEFAULT '19:00',
  "trainDaysCsv" TEXT NOT NULL DEFAULT 'lunes,martes,miercoles,viernes,sabado',
  "prioritiesCsv" TEXT NOT NULL DEFAULT 'pierna,espalda',
  "foodPathologies" TEXT NOT NULL DEFAULT '',
  "injuryPathologies" TEXT NOT NULL DEFAULT '',
  "specialClass" TEXT NOT NULL DEFAULT 'zumba_instructor_jean',
  "targetKg" INTEGER NOT NULL DEFAULT 4,
  "targetMonths" INTEGER NOT NULL DEFAULT 4,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "goalDirection" TEXT NOT NULL DEFAULT 'mantener';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "fitnessGoal" TEXT NOT NULL DEFAULT 'recomposicion';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "activityLevel" TEXT NOT NULL DEFAULT 'moderado';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "dailySteps" INTEGER NOT NULL DEFAULT 7000;
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "trainingPlace" TEXT NOT NULL DEFAULT 'gym';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "trainTime" TEXT NOT NULL DEFAULT '19:00';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "trainDaysCsv" TEXT NOT NULL DEFAULT 'lunes,martes,miercoles,viernes,sabado';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "prioritiesCsv" TEXT NOT NULL DEFAULT 'pierna,espalda';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "foodPathologies" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "injuryPathologies" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "specialClass" TEXT NOT NULL DEFAULT 'zumba_instructor_jean';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "targetKg" INTEGER NOT NULL DEFAULT 4;
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "targetMonths" INTEGER NOT NULL DEFAULT 4;

CREATE TABLE IF NOT EXISTS "BodyMetric" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "weight" DOUBLE PRECISION,
  "waist" DOUBLE PRECISION,
  "chest" DOUBLE PRECISION,
  "arm" DOUBLE PRECISION,
  "photo" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BodyMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "BodyMetric_userId_date_idx" ON "BodyMetric"("userId", "date");

CREATE TABLE IF NOT EXISTS "WorkoutEntry" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "day" TEXT NOT NULL,
  "exercise" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "weight" DOUBLE PRECISION NOT NULL,
  "rpe" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WorkoutEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "WorkoutEntry_userId_day_date_idx" ON "WorkoutEntry"("userId", "day", "date");

CREATE TABLE IF NOT EXISTS "CommunityMessage" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommunityMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "CommunityMessage_userId_createdAt_idx" ON "CommunityMessage"("userId", "createdAt");
