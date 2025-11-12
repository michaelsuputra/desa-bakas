/*
  Warnings:

  - You are about to drop the column `age` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `country_flag` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_checkout` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_stay` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `impression` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_people` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `passport` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_user_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "age",
DROP COLUMN "contact",
DROP COLUMN "country",
DROP COLUMN "country_flag",
DROP COLUMN "date_of_checkout",
DROP COLUMN "date_of_stay",
DROP COLUMN "impression",
DROP COLUMN "number_of_people",
DROP COLUMN "passport",
DROP COLUMN "role",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "fullname" DROP NOT NULL;

-- DropTable
DROP TABLE "account";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kuisioner_guesthouse" (
    "kuisioner_id" TEXT NOT NULL,
    "guesthouse_name" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "age" INTEGER,
    "number_of_people" INTEGER,
    "contact" TEXT,
    "country" TEXT,
    "country_flag" TEXT,
    "date_of_stay" TIMESTAMP(3),
    "date_of_checkout" TIMESTAMP(3),
    "passport" TEXT,
    "impression" TEXT,
    "booking_at" TEXT,

    CONSTRAINT "kuisioner_guesthouse_pkey" PRIMARY KEY ("kuisioner_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "Account"("provider", "provider_account_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
