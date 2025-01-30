import { $Enums, Prisma } from "@prisma/client";

export class ProviderCredential implements Prisma.ProviderCredentialUncheckedCreateInput  {
    id?: string;
    companyId?: string;
    providerId: string;
    type: $Enums.CredentialType;
    key: string;
    value: string;
    isActive?: boolean;
    expiresAt?: string | Date;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
