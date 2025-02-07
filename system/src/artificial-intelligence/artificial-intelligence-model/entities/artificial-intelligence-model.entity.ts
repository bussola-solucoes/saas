import { Prisma } from "@prisma/client";

export class ArtificialIntelligenceModel implements Prisma.ArtificialIntelligenceModelUncheckedCreateInput {
    id?: string;
    objectId?: string;
    platformId: string;
    model: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
