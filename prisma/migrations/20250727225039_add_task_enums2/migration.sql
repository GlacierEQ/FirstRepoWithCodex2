/*
  Warnings:

  - The values [other,painting] on the enum `TaskCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskCategory_new" AS ENUM ('appliance_repair', 'carpentry', 'cooking', 'house_cleaning', 'dj_services', 'electricity', 'furniture_assembly', 'furniture_repair', 'home_repairs', 'IT_support', 'moving_transportation', 'childcare_babysitting', 'nursing_care', 'house_painting', 'room_painting', 'pest_control', 'pet_care_dog_walking', 'plumbing', 'gardening', 'pool_cleaning');
ALTER TABLE "Task" ALTER COLUMN "category" TYPE "TaskCategory_new" USING ("category"::text::"TaskCategory_new");
ALTER TYPE "TaskCategory" RENAME TO "TaskCategory_old";
ALTER TYPE "TaskCategory_new" RENAME TO "TaskCategory";
DROP TYPE "TaskCategory_old";
COMMIT;
