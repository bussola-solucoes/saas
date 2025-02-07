-- CreateTable
CREATE TABLE "ArtificialIntelligenceType" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL DEFAULT 'artificialIntelligenceType',
    "platform" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,

    CONSTRAINT "ArtificialIntelligenceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtificialIntelligenceModel" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL DEFAULT 'artificialIntelligenceModel',
    "platformId" TEXT NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "ArtificialIntelligenceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtificialIntelligenceConversation" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL DEFAULT 'artificialIntelligenceConversation',
    "companyId" TEXT,
    "waId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtificialIntelligenceConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtificialIntelligence" (
    "id" TEXT NOT NULL,
    "objectId" TEXT DEFAULT 'artificialIntelligence',
    "companyId" TEXT,
    "platform" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL DEFAULT '',
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "assistantId" TEXT NOT NULL DEFAULT '',
    "aiVersion" TEXT NOT NULL DEFAULT 'assistants=v2',
    "nameAI" TEXT DEFAULT 'Jomf',
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtificialIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtificialIntelligenceType_platform_key" ON "ArtificialIntelligenceType"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "ArtificialIntelligenceType_baseUrl_key" ON "ArtificialIntelligenceType"("baseUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ArtificialIntelligenceType_platform_baseUrl_key" ON "ArtificialIntelligenceType"("platform", "baseUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ArtificialIntelligenceModel_model_key" ON "ArtificialIntelligenceModel"("model");

-- AddForeignKey
ALTER TABLE "ArtificialIntelligenceModel" ADD CONSTRAINT "ArtificialIntelligenceModel_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "ArtificialIntelligenceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligenceConversation" ADD CONSTRAINT "ArtificialIntelligenceConversation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligence" ADD CONSTRAINT "ArtificialIntelligence_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligence" ADD CONSTRAINT "ArtificialIntelligence_platform_baseUrl_fkey" FOREIGN KEY ("platform", "baseUrl") REFERENCES "ArtificialIntelligenceType"("platform", "baseUrl") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtificialIntelligence" ADD CONSTRAINT "ArtificialIntelligence_model_fkey" FOREIGN KEY ("model") REFERENCES "ArtificialIntelligenceModel"("model") ON DELETE RESTRICT ON UPDATE CASCADE;
