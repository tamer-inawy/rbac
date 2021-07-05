import { Collection } from 'src/collections/collection.entity';

export class CreateItemDto {
  name: string;
  parent: Collection;
}
