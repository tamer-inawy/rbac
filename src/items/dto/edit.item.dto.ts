import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from 'src/items/dto/create.item.dto';

export class EditItemDto extends PartialType(CreateItemDto) {}
