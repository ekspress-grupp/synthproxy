import * as fs from 'fs';
import * as path from 'path';

import * as ffmpeg from 'fluent-ffmpeg';

import { filesDir } from './synth';

const changeFileExt = (filename: string, newExt: string): string => {
  const pieces = filename.split('.');
  pieces.pop();
  return `${pieces.join('.')}.${newExt}`;
};

export default (filename: string, extension: string): Promise<string> =>
  new Promise(resolve => {
    if (extension === 'wav') {
      // XXX: support wav as param (default file is wav)
      return resolve(filename);
    }
    if (extension !== 'mp3') {
      throw new Error(
        `file extension '${extension}' not supported! (try mp3?)`,
      );
    }
    const input = path.join(filesDir, filename);
    const output = changeFileExt(input, extension);
    console.log('audioConvert', input, output);

    // ffmpeg -i public/XXXX.wav -codec:a libmp3lame public/XXXX.mp3
    ffmpeg(input)
      .audioCodec('libmp3lame')
      .on('error', (err: Error) => {
        throw err;
      })
      .on('end', () => {
        resolve(path.basename(output));
        // remove old file in background
        fs.unlink(input, (err: Error) => {
          if (err) {
            throw err;
          }
          console.log('removed-old-wav', input);
        });
      })
      .saveToFile(output);
  });
