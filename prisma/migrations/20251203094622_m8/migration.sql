-- AlterTable
ALTER TABLE "kuisioner_guesthouse" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "review_guesthouse" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "kuisioner_guesthouse" ADD CONSTRAINT "kuisioner_guesthouse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_guesthouse" ADD CONSTRAINT "review_guesthouse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
