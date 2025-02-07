/*
  Warnings:

  - You are about to drop the column `model` on the `ArtificialIntelligence` table. All the data in the column will be lost.
  - Added the required column `modelId` to the `ArtificialIntelligence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArtificialIntelligence" DROP CONSTRAINT "ArtificialIntelligence_model_fkey";

-- AlterTable
ALTER TABLE "ArtificialIntelligence" DROP COLUMN "model",
ADD COLUMN     "modelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligence" ADD CONSTRAINT "ArtificialIntelligence_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ArtificialIntelligenceModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
