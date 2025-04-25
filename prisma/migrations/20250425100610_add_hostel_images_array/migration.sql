/*
  Warnings:

  - You are about to drop the column `image` on the `Hostel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hostel" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
