import { AutowireComponent } from '../app/expressDecorator';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

export interface ImageServiceInterface {
  generateImage(prompt: string): Promise<Buffer>;
}

@AutowireComponent
export class ImageService implements ImageServiceInterface {
  private execAsync = promisify(exec);

  async generateImage(prompt: string): Promise<Buffer> {
    // TODO: implement image generation using sd-cli
    const outputPath = path.join(__dirname, '../../output.png');
    const command = `C/fun/z-image-cpp/sdcpp/sd-cli --diffusion-model ../models/z_image_turbo-Q4_K_S.gguf --llm ../models/Qwen3-4B-Instruct-2507-Q4_K_S.gguf --vae ../models/ae.safetensors --prompt "${prompt}" --sampling-method res_multistep --scheduler simple --steps 9 --cfg-scale 1.0 --width 640 --height 480 -o ${outputPath} --rng cuda --sampler-rng cuda`;

    try {
      await this.execAsync(command);
      const imageBuffer = fs.readFileSync(outputPath);
      fs.unlinkSync(outputPath); // clean up
      return imageBuffer;
    } catch (error) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }
}