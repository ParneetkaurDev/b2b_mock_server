-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "lastAccessed" TIMESTAMP(3);
