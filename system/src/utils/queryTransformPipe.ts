import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class QueryTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object') {
      return value;
    }

    const result = {};
    for (const key in value) {
      if (key.includes('[') && key.includes(']')) {
        const [parent, child] = key.split(/[\[\]]/);
        if (!result[parent]) {
          result[parent] = {};
        }
        result[parent][child] = value[key];
      } else {
        result[key] = value[key];
      }
    }
    return result;
  }
}
