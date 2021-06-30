import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Collection } from 'src/collections/collection.entity';
import { CreateCollectionDto } from 'src/collections/dto/create.collection.dto';
import { EditCollectionDto } from 'src/collections/dto/edit.collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
  ) {}

  async create(resource: CreateCollectionDto) {
    const newCollection = await this.collectionsRepository.create(resource);
    const collection = await this.collectionsRepository.save(newCollection);

    return collection;
  }

  delete(id: string): Promise<any> {
    return this.collectionsRepository.delete(id);
  }

  list(): Promise<Collection[]> {
    return this.collectionsRepository.find();
  }

  async update(id: string, dto: EditCollectionDto) {
    const collection = await this.findOne(id);
    const editedCollection = Object.assign(collection, dto);
    return this.collectionsRepository.save(editedCollection);
  }

  findOne(id: string): Promise<Collection> {
    return this.collectionsRepository.findOne(id);
  }
}