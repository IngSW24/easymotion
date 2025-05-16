-- AlterTable
ALTER TABLE "Physiotherapist" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "publicAddress" TEXT,
ADD COLUMN     "publicEmail" TEXT,
ADD COLUMN     "socialMediaLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "website" TEXT;
