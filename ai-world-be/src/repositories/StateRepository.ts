import Datastore from 'nedb-promises';
import { AutowireComponent } from '../app/expressDecorator';
import { State } from '../models/State';

export interface StateRepositoryInterface {
  create(state: State): Promise<State>;
  findByWorldIdAndIndex(worldId: number, stateIndex: number): Promise<State | null>;
  findLatestByWorldId(worldId: number): Promise<State | null>;
  findByWorldId(worldId: number, limit?: number, skip?: number): Promise<State[]>;
  countByWorldId(worldId: number): Promise<number>;
}

@AutowireComponent
export class StateRepository implements StateRepositoryInterface {
  private datastore: Datastore<State>;

  constructor() {
    this.datastore = Datastore.create('./data/states.db');
  }

  async create(state: State): Promise<State> {
    const inserted = await this.datastore.insert(state);
    return new State(inserted);
  }

  async findByWorldIdAndIndex(worldId: number, stateIndex: number): Promise<State | null> {
    const doc = await this.datastore.findOne({ worldId, stateIndex });
    return doc ? new State(doc) : null;
  }

  async findLatestByWorldId(worldId: number): Promise<State | null> {
    const docs = await this.datastore.find({ worldId }).sort({ stateIndex: -1 }).limit(1);
    return docs.length > 0 ? new State(docs[0]) : null;
  }

  async findByWorldId(worldId: number, limit: number = 10, skip: number = 0): Promise<State[]> {
    const docs = await this.datastore.find({ worldId }).sort({ stateIndex: -1 }).limit(limit).skip(skip);
    return docs.map(doc => new State(doc));
  }

  async countByWorldId(worldId: number): Promise<number> {
    return await this.datastore.count({ worldId });
  }
}