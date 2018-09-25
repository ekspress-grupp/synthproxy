import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { filesDir } from './path';

interface Imeta {
  duration: number;
  size: number;
  file_extension: string;
}

export default (filename: string): Promise<Imeta> =>
  new Promise(resolve => {
    const file = path.join(filesDir, filename);
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) {
        throw err;
      }

      const meta: Imeta = {
        duration: Math.trunc(metadata.format.duration),
        size: metadata.format.size,
        file_extension: metadata.format.format_name,
      };
      resolve(meta);
      return;
    });
  });
