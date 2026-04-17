import Datastore from 'nedb-promises';
import { AutowireComponent } from '../app/expressDecorator';
import { World } from '../models/World';

export interface WorldRepositoryInterface {
  create(world: World): Promise<World>;
  findById(id: number): Promise<World | null>;
  findAll(): Promise<World[]>;
}

@AutowireComponent
export class WorldRepository implements WorldRepositoryInterface {
  private datastore: Datastore<World>;

  constructor() {
    this.datastore = Datastore.create('./data/worlds.db');
  }

  async create(world: World): Promise<World> {
    const inserted = await this.datastore.insert(world);
    return new World(inserted);
  }

  async findById(id: number): Promise<World | null> {
    const doc = await this.datastore.findOne({ id });
    return doc ? new World(doc) : null;
  }

  async findAll(): Promise<World[]> {
    const docs = await this.datastore.find({});
    return docs.map(doc => new World(doc));
  }
}