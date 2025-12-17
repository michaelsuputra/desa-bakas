/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `guesthouse_transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "guesthouse_transaction_code_key" ON "guesthouse_transaction"("code");
