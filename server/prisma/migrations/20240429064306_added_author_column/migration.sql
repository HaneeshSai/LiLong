/*
  Warnings:

  - Added the required column `author` to the `PlayList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayList" ADD COLUMN     "author" TEXT NOT NULL;
