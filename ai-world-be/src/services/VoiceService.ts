import { AutowireComponent } from '../app/expressDecorator';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

export interface VoiceServiceInterface {
  generateVoice(text: string, voice: string): Promise<Buffer>;
}

@AutowireComponent
export class VoiceService implements VoiceServiceInterface {
  private execAsync = promisify(exec);

  async generateVoice(text: string, voice: string): Promise<Buffer> {
    // TODO: implement voice generation using generate_audio
    const outputPath = path.join(__dirname, '../../output.wav');
    const command = `generate_audio --model-dir models/customvoice-0.6b --text "${text}" --speaker "${voice}" --output ${outputPath}`;

    try {
      await this.execAsync(command);
      const audioBuffer = fs.readFileSync(outputPath);
      fs.unlinkSync(outputPath); // clean up
      return audioBuffer;
    } catch (error) {
      throw new Error(`Voice generation failed: ${error.message}`);
    }
  }
}