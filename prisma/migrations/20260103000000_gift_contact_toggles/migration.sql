-- AlterTable
ALTER TABLE "WeddingProject" ADD COLUMN     "contactName1" TEXT,
ADD COLUMN     "contactName2" TEXT,
ADD COLUMN     "contactPhone1" TEXT,
ADD COLUMN     "contactPhone2" TEXT,
ADD COLUMN     "showContact" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showGift" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showGiftQr" BOOLEAN NOT NULL DEFAULT true;

