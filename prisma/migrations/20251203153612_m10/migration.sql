-- AlterTable
ALTER TABLE "kuisioner_guesthouse" ADD COLUMN     "guesthouse_transaction_id" TEXT;

-- AddForeignKey
ALTER TABLE "kuisioner_guesthouse" ADD CONSTRAINT "kuisioner_guesthouse_guesthouse_transaction_id_fkey" FOREIGN KEY ("guesthouse_transaction_id") REFERENCES "guesthouse_transaction"("guesthouse_transaction_id") ON DELETE SET NULL ON UPDATE CASCADE;
