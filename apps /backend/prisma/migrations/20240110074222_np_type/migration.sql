/*
  Warnings:

  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NetworkPaticipantType" AS ENUM ('BAP', 'BPP', 'BG', 'BREG');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "NetworkPaticipantType" NOT NULL;
