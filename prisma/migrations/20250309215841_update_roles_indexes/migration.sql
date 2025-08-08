/*
  Warnings:

  - Added the required column `category` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'client';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'worker';

-- CreateIndex
CREATE INDEX "Task_clientId_idx" ON "Task"("clientId");

-- CreateIndex
CREATE INDEX "Task_workerId_idx" ON "Task"("workerId");

-- Add CHECK constraint to enforce experienceYears XOR experienceMonths
-- ⚠️ Reminder: This constraint is added manually to migration.sql

ALTER TABLE "Worker"
ADD CONSTRAINT check_experience
CHECK (
  ("experienceYears" IS NOT NULL OR "experienceMonths" IS NOT NULL)
  AND NOT ("experienceYears" IS NOT NULL AND "experienceMonths" IS NOT NULL)
);
