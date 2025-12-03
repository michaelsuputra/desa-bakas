-- CreateEnum
CREATE TYPE "status_order" AS ENUM ('pending', 'success', 'failed');

-- AlterTable
ALTER TABLE "guesthouse" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 800000;

-- CreateTable
CREATE TABLE "guesthouse_transaction" (
    "guesthouse_transaction_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "status" "status_order" NOT NULL,
    "code" TEXT NOT NULL,
    "invoice_url" TEXT NOT NULL,
    "guesthouse_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "guesthouse_transaction_pkey" PRIMARY KEY ("guesthouse_transaction_id")
);

-- AddForeignKey
ALTER TABLE "guesthouse_transaction" ADD CONSTRAINT "guesthouse_transaction_guesthouse_id_fkey" FOREIGN KEY ("guesthouse_id") REFERENCES "guesthouse"("guesthouse_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guesthouse_transaction" ADD CONSTRAINT "guesthouse_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
