/*
  Warnings:

  - You are about to drop the column `age` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `country_flag` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_checkout` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_stay` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `impression` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_people` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `passport` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "age",
DROP COLUMN "contact",
DROP COLUMN "country",
DROP COLUMN "country_flag",
DROP COLUMN "date_of_checkout",
DROP COLUMN "date_of_stay",
DROP COLUMN "fullname",
DROP COLUMN "impression",
DROP COLUMN "number_of_people",
DROP COLUMN "passport",
DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "kuisioner_guesthouse" (
    "kuisioner_id" TEXT NOT NULL,
    "guesthouse_name" TEXT,
    "fullname" TEXT NOT NULL,
    "age" INTEGER,
    "number_of_people" INTEGER,
    "contact" INTEGER,
    "country" TEXT,
    "country_flag" TEXT,
    "date_of_stay" TIMESTAMP(3),
    "date_of_checkout" TIMESTAMP(3),
    "passport" TEXT,
    "impression" TEXT,
    "booking_at" TEXT,

    CONSTRAINT "kuisioner_guesthouse_pkey" PRIMARY KEY ("kuisioner_id")
);
