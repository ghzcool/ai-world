import { Request, Response } from 'express';
import { Autowire, ExpressController, GetMapping, PostMapping } from '../app/expressDecorator';
import { WorldServiceInterface } from '../services/WorldService';

@ExpressController
export class WorldController {
  @Autowire('WorldService')
  private worldService: WorldServiceInterface;

  @GetMapping('/world/:id')
  async getWorld(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const world = await this.worldService.getWorld(id);
      if (!world) {
        return res.status(404).json({ error: 'World not found' });
      }
      res.json(world);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @PostMapping('/world')
  async createWorld(req: Request, res: Response) {
    try {
      const worldData = req.body;
      const world = await this.worldService.createWorld(worldData);
      res.json(world);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  @GetMapping('/worlds')
  async getWorlds(req: Request, res: Response) {
    try {
      const worlds = await this.worldService.getWorlds();
      res.json(worlds);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  @GetMapping('/world/:id/state/latest')
  async getLatestState(req: Request, res: Response) {
    try {
      const worldId = parseInt(req.params.id);
      const state = await this.worldService.getLatestState(worldId);
      if (!state) {
        return res.status(404).json({ error: 'State not found' });
      }
      res.json(state);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @GetMapping('/world/:id/state/:index')
  async getState(req: Request, res: Response) {
    try {
      const worldId = parseInt(req.params.id);
      const stateIndex = parseInt(req.params.index);
      const state = await this.worldService.getState(worldId, stateIndex);
      if (!state) {
        return res.status(404).json({ error: 'State not found' });
      }
      res.json(state);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @GetMapping('/world/:id/state/list')
  async getStatesList(req: Request, res: Response) {
    try {
      const worldId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;
      const result = await this.worldService.getStatesList(worldId, limit, skip);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @PostMapping('/world/:id/action')
  async performAction(req: Request, res: Response) {
    try {
      const worldId = parseInt(req.params.id);
      const actionData = req.body;
      const newState = await this.worldService.performAction(worldId, actionData);
      res.json(newState);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}