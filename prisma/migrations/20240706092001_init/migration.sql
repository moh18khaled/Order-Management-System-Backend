/*
  Warnings:

  - You are about to drop the column `name` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `arrivesAt` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "name",
ADD COLUMN     "arrivesAt" TIMESTAMP(3) NOT NULL;
