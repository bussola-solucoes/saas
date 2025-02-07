/*
  Warnings:

  - You are about to drop the column `baseUrl` on the `ArtificialIntelligence` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `ArtificialIntelligence` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `ArtificialIntelligence` table. All the data in the column will be lost.
  - Added the required column `model` to the `ArtificialIntelligence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformId` to the `ArtificialIntelligence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArtificialIntelligence" DROP CONSTRAINT "ArtificialIntelligence_modelId_fkey";

-- DropForeignKey
ALTER TABLE "ArtificialIntelligence" DROP CONSTRAINT "ArtificialIntelligence_platform_baseUrl_fkey";

-- AlterTable
ALTER TABLE "ArtificialIntelligence" DROP COLUMN "baseUrl",
DROP COLUMN "modelId",
DROP COLUMN "platform",
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "platformId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligence" ADD CONSTRAINT "ArtificialIntelligence_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "ArtificialIntelligenceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
