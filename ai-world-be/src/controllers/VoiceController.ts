import { Request, Response } from 'express';
import { Autowire, ExpressController, GetMapping } from '../app/expressDecorator';
import { VoiceServiceInterface } from '../services/VoiceService';

@ExpressController
export class VoiceController {
  @Autowire('VoiceService')
  private voiceService: VoiceServiceInterface;

  @GetMapping('/voice')
  async generateVoice(req: Request, res: Response) {
    try {
      const text = req.query.text as string;
      const voice = req.query.voice as string;
      if (!text || !voice) {
        return res.status(400).json({ error: 'Text and voice are required' });
      }
      const audioBuffer = await this.voiceService.generateVoice(text, voice);
      res.setHeader('Content-Type', 'audio/wav');
      res.send(audioBuffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}