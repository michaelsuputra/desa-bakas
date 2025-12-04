/*
  Warnings:

  - A unique constraint covering the columns `[guesthouse_transaction_id]` on the table `kuisioner_guesthouse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guesthouse_transaction_id]` on the table `review_guesthouse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "kuisioner_guesthouse_guesthouse_transaction_id_key" ON "kuisioner_guesthouse"("guesthouse_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_guesthouse_guesthouse_transaction_id_key" ON "review_guesthouse"("guesthouse_transaction_id");
