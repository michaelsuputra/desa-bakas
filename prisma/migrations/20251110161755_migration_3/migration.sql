/*
  Warnings:

  - Made the column `guesthouse_name` on table `kuisioner_guesthouse` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "kuisioner_guesthouse" ALTER COLUMN "guesthouse_name" SET NOT NULL;
