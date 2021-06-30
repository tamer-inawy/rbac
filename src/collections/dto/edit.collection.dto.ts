import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from 'src/collections/dto/create.collection.dto';

export class EditCollectionDto extends PartialType(CreateCollectionDto) {}
