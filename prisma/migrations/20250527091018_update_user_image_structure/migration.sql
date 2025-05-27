/*
  Warnings:

  - The `image` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Hostel" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
DROP COLUMN "image",
ADD COLUMN     "image" JSONB;
