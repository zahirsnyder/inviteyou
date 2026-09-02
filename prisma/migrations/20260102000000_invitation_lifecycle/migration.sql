-- DropIndex
DROP INDEX "TemplatePurchase_userId_themeId_key";

-- AlterTable
ALTER TABLE "TemplatePurchase" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "WeddingProject" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "lockedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "TemplatePurchase_projectId_key" ON "TemplatePurchase"("projectId");

-- CreateIndex
CREATE INDEX "TemplatePurchase_userId_themeId_status_idx" ON "TemplatePurchase"("userId", "themeId", "status");

-- AddForeignKey
ALTER TABLE "TemplatePurchase" ADD CONSTRAINT "TemplatePurchase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "WeddingProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

