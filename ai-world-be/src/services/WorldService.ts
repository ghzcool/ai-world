import { Autowire, AutowireComponent } from '../app/expressDecorator';
import { WorldRepositoryInterface } from '../repositories/WorldRepository';
import { StateRepositoryInterface } from '../repositories/StateRepository';
import { World } from '../models/World';
import { State, TextItem } from '../models/State';

export interface WorldServiceInterface {
  createWorld(worldData: { id: number; name: string; description: string }): Promise<World>;
  getWorld(id: number): Promise<World | null>;
  getWorlds(): Promise<World[]>;
  getLatestState(worldId: number): Promise<State | null>;
  getState(worldId: number, stateIndex: number): Promise<State | null>;
  getStatesList(worldId: number, limit?: number, skip?: number): Promise<{ items: State[]; total: number }>;
  performAction(worldId: number, actionData: { stateIndex: number; to: string; action: string; content: string; duration: number }): Promise<State>;
}

@AutowireComponent
export class WorldService implements WorldServiceInterface {
  @Autowire('WorldRepository')
  private worldRepository: WorldRepositoryInterface;

  @Autowire('StateRepository')
  private stateRepository: StateRepositoryInterface;

  async createWorld(worldData: { id: number; name: string; description: string }): Promise<World> {
    const world = new World(worldData);
    const createdWorld = await this.worldRepository.create(world);
    const initialState = new State({
      worldId: createdWorld.id,
      stateIndex: 0,
      imagePrompt: '',
      texts: [],
      turn: 'user'
    });
    await this.stateRepository.create(initialState);
    return createdWorld;
  }

  async getWorld(id: number): Promise<World | null> {
    return await this.worldRepository.findById(id);
  }

  async getWorlds(): Promise<World[]> {
    return await this.worldRepository.findAll();
  }

  async getLatestState(worldId: number): Promise<State | null> {
    return await this.stateRepository.findLatestByWorldId(worldId);
  }

  async getState(worldId: number, stateIndex: number): Promise<State | null> {
    return await this.stateRepository.findByWorldIdAndIndex(worldId, stateIndex);
  }

  async getStatesList(worldId: number, limit: number = 10, skip: number = 0): Promise<{ items: State[]; total: number }> {
    const items = await this.stateRepository.findByWorldId(worldId, limit, skip);
    const total = await this.stateRepository.countByWorldId(worldId);
    return { items, total };
  }

  async performAction(worldId: number, actionData: { stateIndex: number; to: string; action: string; content: string; duration: number }): Promise<State> {
    // TODO: implement AI logic to generate next state based on action
    const currentState = await this.getState(worldId, actionData.stateIndex);
    if (!currentState) {
      throw new Error('Current state not found');
    }

    const newStateIndex = currentState.stateIndex + 1;
    const newTexts: TextItem[] = [...currentState.texts, {
      who: 'user', // TODO: determine who
      to: actionData.to,
      action: actionData.action,
      content: actionData.content
    }];

    // TODO: generate new imagePrompt, turn, and possibly AI responses
    const newState = new State({
      worldId,
      stateIndex: newStateIndex,
      imagePrompt: currentState.imagePrompt, // placeholder
      texts: newTexts,
      turn: 'ai' // placeholder
    });

    return await this.stateRepository.create(newState);
  }
}