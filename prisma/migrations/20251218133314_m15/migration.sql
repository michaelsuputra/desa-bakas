-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('NEWS', 'EVENT');

-- CreateTable
CREATE TABLE "news_event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL DEFAULT 'NEWS',
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "location" TEXT,
    "event_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_event_slug_key" ON "news_event"("slug");

-- CreateIndex
CREATE INDEX "news_event_slug_idx" ON "news_event"("slug");
