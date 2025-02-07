/*
  Warnings:

  - You are about to drop the column `platformId` on the `ArtificialIntelligence` table. All the data in the column will be lost.
  - Added the required column `baseUrl` to the `ArtificialIntelligence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `ArtificialIntelligence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArtificialIntelligence" DROP CONSTRAINT "ArtificialIntelligence_platformId_fkey";

-- AlterTable
ALTER TABLE "ArtificialIntelligence" DROP COLUMN "platformId",
ADD COLUMN     "baseUrl" TEXT NOT NULL,
ADD COLUMN     "platform" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligence" ADD CONSTRAINT "ArtificialIntelligence_platform_baseUrl_fkey" FOREIGN KEY ("platform", "baseUrl") REFERENCES "ArtificialIntelligenceType"("platform", "baseUrl") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligence" ADD CONSTRAINT "ArtificialIntelligence_model_fkey" FOREIGN KEY ("model") REFERENCES "ArtificialIntelligenceModel"("model") ON DELETE RESTRICT ON UPDATE CASCADE;
