import { CollectionsService } from 'src/collections/collections.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/item.entity';
import { CreateItemDto } from 'src/items/dto/create.item.dto';
import { EditItemDto } from 'src/items/dto/edit.item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    private collectionsService: CollectionsService,
  ) {}

  async create(resource: CreateItemDto) {
    const newItem = await this.itemsRepository.create(resource);
    const item = await this.itemsRepository.save(newItem);

    return item;
  }

  delete(id: string): Promise<any> {
    return this.itemsRepository.delete(id);
  }

  list(): Promise<Item[]> {
    return this.itemsRepository.find({ relations: ['parent'] });
  }

  listByGroups(groups: Array<number>): Promise<Item[]> {
    return this.itemsRepository
      .find({ relations: ['parent', 'parent.grp'] })
      .then((items) =>
        items.filter((item) => {
          return groups.includes(item.parent.grp?.id);
        }),
      );
  }

  async update(id: string, dto: EditItemDto) {
    const item = await this.findOne(id);
    if (!item) return null;

    const editedItem = Object.assign(item, dto);
    return this.itemsRepository.save(editedItem);
  }

  findOne(id: string): Promise<Item> {
    return this.itemsRepository.findOne(id, {
      relations: ['parent', 'parent.grp'],
    });
  }
}
