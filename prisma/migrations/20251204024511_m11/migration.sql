/*
  Warnings:

  - You are about to drop the column `fullname` on the `kuisioner_guesthouse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guesthouse_transaction" ALTER COLUMN "total_price" DROP NOT NULL,
ALTER COLUMN "night_count" DROP NOT NULL;

-- AlterTable
ALTER TABLE "kuisioner_guesthouse" DROP COLUMN "fullname";
