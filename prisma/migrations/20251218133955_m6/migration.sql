/*
  Warnings:

  - You are about to drop the column `slug` on the `news_event` table. All the data in the column will be lost.
  - The `image_url` column on the `news_event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "news_event_slug_idx";

-- DropIndex
DROP INDEX "news_event_slug_key";

-- AlterTable
ALTER TABLE "news_event" DROP COLUMN "slug",
DROP COLUMN "image_url",
ADD COLUMN     "image_url" TEXT[];
