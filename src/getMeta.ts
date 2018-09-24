import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { filesDir } from './synth';

interface Imeta {
  duration: number;
  size: number;
}

export default (filename: string): Promise<Imeta> =>
  new Promise(resolve => {
    const file = path.join(filesDir, filename);
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) {
        throw err;
      }

      const meta = {
        duration: Math.trunc(metadata.format.duration),
        size: metadata.format.size,
      };
      resolve(meta);
      return;
    });
  });
