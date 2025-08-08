/*
  Warnings:

  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `category` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('open', 'assigned', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('appliance_repair', 'carpentry', 'cooking', 'house_cleaning', 'dj_services', 'electricity', 'furniture_assembly', 'gardening', 'home_repairs', 'IT_support', 'moving_transportation', 'childcare_babysitting', 'nursing_care', 'other', 'painting', 'pest_control', 'pet_care_dog_walking', 'plumbing', 'pool_cleaning');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'open',
DROP COLUMN "category",
ADD COLUMN     "category" "TaskCategory" NOT NULL;
