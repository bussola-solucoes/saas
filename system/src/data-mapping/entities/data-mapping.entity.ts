import { Prisma } from "@prisma/client";

export class DataMapping implements Prisma.DataMappingUncheckedCreateInput  {
    id?: string;
    companyId?: string;
    endpointId: string;
    sourceField: string;
    targetField: string;
    transformation?: string;
    isRequired?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
