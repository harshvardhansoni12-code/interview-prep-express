/*
  Warnings:

  - Added the required column `authorId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_id_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
