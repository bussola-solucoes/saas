import { $Enums, Prisma } from "@prisma/client";

export class ExternalProvider implements Prisma.ExternalProviderUncheckedCreateInput {
    id?: string;
    companyId?: string;
    name: string;
    description?: string;
    baseUrl: string;
    status?: $Enums.ProviderStatus;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    integrations?: Prisma.IntegrationUncheckedCreateNestedManyWithoutProviderInput;
    endpoints?: Prisma.ProviderEndpointUncheckedCreateNestedManyWithoutProviderInput;
    credentials?: Prisma.ProviderCredentialUncheckedCreateNestedManyWithoutProviderInput;
}
