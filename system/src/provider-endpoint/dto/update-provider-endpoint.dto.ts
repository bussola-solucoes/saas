import { PartialType } from '@nestjs/swagger';
import { CreateProviderEndpointDto } from './create-provider-endpoint.dto';

export class UpdateProviderEndpointDto extends PartialType(CreateProviderEndpointDto) {}
