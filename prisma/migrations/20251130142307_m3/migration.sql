/*
  Warnings:

  - You are about to drop the column `created_at` on the `guesthouse` table. All the data in the column will be lost.
  - You are about to drop the column `impression` on the `kuisioner_guesthouse` table. All the data in the column will be lost.
  - Added the required column `guesthouse_description` to the `guesthouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guesthouse_location` to the `guesthouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guesthouse_map_url` to the `guesthouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guesthouse" DROP COLUMN "created_at",
ADD COLUMN     "guesthouse_description" TEXT NOT NULL,
ADD COLUMN     "guesthouse_images" TEXT[],
ADD COLUMN     "guesthouse_location" TEXT NOT NULL,
ADD COLUMN     "guesthouse_map_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "kuisioner_guesthouse" DROP COLUMN "impression";

-- AlterTable
ALTER TABLE "review_guesthouse" ADD COLUMN     "review_image" TEXT;
