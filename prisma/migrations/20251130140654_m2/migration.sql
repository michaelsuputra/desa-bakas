/*
  Warnings:

  - You are about to drop the column `guesthouse_name` on the `kuisioner_guesthouse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kuisioner_guesthouse" DROP COLUMN "guesthouse_name",
ADD COLUMN     "guesthouse_id" TEXT;

-- CreateTable
CREATE TABLE "guesthouse" (
    "guesthouse_id" TEXT NOT NULL,
    "guesthouse_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guesthouse_pkey" PRIMARY KEY ("guesthouse_id")
);

-- CreateTable
CREATE TABLE "review_guesthouse" (
    "review_id" TEXT NOT NULL,
    "impression" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "guesthouse_id" TEXT,

    CONSTRAINT "review_guesthouse_pkey" PRIMARY KEY ("review_id")
);

-- AddForeignKey
ALTER TABLE "kuisioner_guesthouse" ADD CONSTRAINT "kuisioner_guesthouse_guesthouse_id_fkey" FOREIGN KEY ("guesthouse_id") REFERENCES "guesthouse"("guesthouse_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_guesthouse" ADD CONSTRAINT "review_guesthouse_guesthouse_id_fkey" FOREIGN KEY ("guesthouse_id") REFERENCES "guesthouse"("guesthouse_id") ON DELETE SET NULL ON UPDATE CASCADE;
