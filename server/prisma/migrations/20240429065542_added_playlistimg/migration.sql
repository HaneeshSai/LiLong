/*
  Warnings:

  - Added the required column `img` to the `PlayList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayList" ADD COLUMN     "img" TEXT NOT NULL;
