/*
  Warnings:

  - A unique constraint covering the columns `[auth0Id]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[auth0Id]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "auth0Id" TEXT;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "auth0Id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_auth0Id_key" ON "Client"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_auth0Id_key" ON "Worker"("auth0Id");
