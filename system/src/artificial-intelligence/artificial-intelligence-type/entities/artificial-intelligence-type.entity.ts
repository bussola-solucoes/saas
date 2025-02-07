import { Prisma } from "@prisma/client";

export class ArtificialIntelligenceType implements Prisma.ArtificialIntelligenceTypeUncheckedCreateInput {
    id?: string;
    objectId?: string;
    platform: string;
    baseUrl: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
