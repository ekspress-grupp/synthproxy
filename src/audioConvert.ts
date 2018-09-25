import * as ffmpeg from 'fluent-ffmpeg';
import { unlink } from 'fs';
import { basename, join as joinPath } from 'path';
import { filesDir } from './path';

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
    const input = joinPath(filesDir, filename);
    const output = changeFileExt(input, extension);
    console.log('audioConvert', input, output);

    // ffmpeg -i public/XXXX.wav -codec:a libmp3lame public/XXXX.mp3
    ffmpeg(input)
      .audioCodec('libmp3lame')
      .on('error', (err: Error) => {
        throw err;
      })
      .on('end', () => {
        resolve(basename(output));
        // remove old file in background
        unlink(input, (err: Error) => {
          if (err) {
            throw err;
          }
          console.log('removed-old-wav', input);
        });
      })
      .saveToFile(output);
  });
