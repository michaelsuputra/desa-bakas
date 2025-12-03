/*
  Warnings:

  - The primary key for the `guesthouse_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `check_in` to the `guesthouse_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_out` to the `guesthouse_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guesthouse_transaction" DROP CONSTRAINT "guesthouse_transaction_pkey",
ADD COLUMN     "check_in" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "check_out" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "guesthouse_transaction_id" DROP DEFAULT,
ALTER COLUMN "guesthouse_transaction_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "guesthouse_transaction_pkey" PRIMARY KEY ("guesthouse_transaction_id");
DROP SEQUENCE "guesthouse_transaction_guesthouse_transaction_id_seq";
