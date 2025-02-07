import { Prisma } from "@prisma/client";

export class ArtificialIntelligenceConversation implements Prisma.ArtificialIntelligenceConversationUncheckedCreateInput {
    id?: string;
    objectId?: string;
    companyId?: string;
    waId: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
