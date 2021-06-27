import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from 'src/groups/dto/create.group.dto';

export class EditGroupDto extends PartialType(CreateGroupDto) {}
