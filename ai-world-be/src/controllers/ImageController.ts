import { Request, Response } from 'express';
import { Autowire, ExpressController, GetMapping } from '../app/expressDecorator';
import { ImageServiceInterface } from '../services/ImageService';

@ExpressController
export class ImageController {
  @Autowire('ImageService')
  private imageService: ImageServiceInterface;

  @GetMapping('/image')
  async generateImage(req: Request, res: Response) {
    try {
      const prompt = req.query.prompt as string;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      const imageBuffer = await this.imageService.generateImage(prompt);
      res.setHeader('Content-Type', 'image/png');
      res.send(imageBuffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}