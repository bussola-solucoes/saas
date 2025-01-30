import { $Enums, Prisma } from "@prisma/client";

export class ProviderEndpoint implements Prisma.ProviderEndpointUncheckedCreateInput {
    id?: string;
    companyId?: string;
    providerId: string;
    name: string;
    path: string;
    method: $Enums.HttpMethod;
    description?: string;
    parameters?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
    headers?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    mappings?: Prisma.DataMappingUncheckedCreateNestedManyWithoutEndpointInput;
}
