-- AlterTable
ALTER TABLE "guesthouse_transaction" ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "invoice_url" DROP NOT NULL;
