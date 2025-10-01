/*
  Warnings:

  - You are about to drop the column `lastSeen` on the `RoomUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."RoomUser" DROP COLUMN "lastSeen",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "leftAt" TIMESTAMP(3);
