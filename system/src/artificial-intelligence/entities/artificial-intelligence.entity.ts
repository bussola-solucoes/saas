import { Prisma } from "@prisma/client";

export class ArtificialIntelligence implements Prisma.ArtificialIntelligenceUncheckedCreateInput {
    id?: string;
    objectId?: string;
    companyId?: string;
    platform: string;
    baseUrl: string;
    apiKey?: string;
    prompt: string;
    model: string;
    assistantId?: string;
    aiVersion?: string;
    nameAI?: string;
    projectId: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
        
}
