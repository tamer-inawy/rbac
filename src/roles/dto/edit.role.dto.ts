import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from 'src/roles/dto/create.role.dto';

export class EditRoleDto extends PartialType(CreateRoleDto) {}
