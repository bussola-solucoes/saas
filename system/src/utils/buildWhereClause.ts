import { $Enums } from '@prisma/client';

function isNumeric(value: any): boolean {
  return !isNaN(value - parseFloat(value));
}

function isDate(value: any): boolean {
  return !isNaN(Date.parse(value));
}

export function buildWhereClause<T>(filters: any, companyId: string): T {
  const where = { companyId: companyId } as T;

  for (const key in filters) {
    const [field, operator] = key.split('_');
    if (!where[field]) {
      where[field] = { companyId: companyId };
    }

    switch (operator) {
      case 'contains':
        where[field] = { companyId: companyId, contains: filters[key], mode: 'insensitive' };
        break;
      case 'eq':
        if (field === 'id' || field.endsWith('Id')) {
          where[field] = { companyId: companyId, equals: filters[key] };
        } else if (isNumeric(filters[key])) {
          where[field] = { companyId: companyId, equals: parseFloat(filters[key]) };
        } else if (
          (Object.values($Enums.StatusSendWAPP) as string[]).includes(filters[key])
        ) {
          where[field] = { companyId: companyId, equals: filters[key] as $Enums.StatusSendWAPP };
        } else {
          where[field] = { companyId: companyId, equals:  filters[key], mode: 'insensitive' };
        }
        break;
      case 'gte':
        if (isNumeric(filters[key])) {
          where[field] = { companyId: companyId, gte: parseFloat(filters[key]) };
        } else if (isDate(filters[key])) {
          where[field] = { companyId: companyId, gte: new Date(filters[key]) };
        }
        break;

      case 'lte':
        if (isNumeric(filters[key])) {
          where[field] = { companyId: companyId, lte: parseFloat(filters[key]) };
        } else if (isDate(filters[key])) {
          where[field] = { companyId: companyId, lte: new Date(filters[key]) };
        }
        break;
      case 'not':
        if (
          (Object.values($Enums.StatusSendWAPP) as string[]).includes(filters[key])
        ) {
          where[field] = { companyId: companyId, not: filters[key] as $Enums.StatusSendWAPP};
        } else {
          where[field] = { companyId: companyId, not: filters[key], mode: 'insensitive' };
        }
        break;;
      default:
        break;
    }
  }

  return where;
}
