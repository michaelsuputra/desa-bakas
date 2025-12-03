/*
  Warnings:

  - You are about to drop the column `quantity` on the `guesthouse_transaction` table. All the data in the column will be lost.
  - Added the required column `night_count` to the `guesthouse_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guesthouse_transaction" DROP COLUMN "quantity",
ADD COLUMN     "night_count" INTEGER NOT NULL;
