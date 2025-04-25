-- CreateEnum
CREATE TYPE "HostelStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Hostel" ADD COLUMN     "status" "HostelStatus" NOT NULL DEFAULT 'ACTIVE';
