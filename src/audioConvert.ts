import * as ffmpeg from 'fluent-ffmpeg';

export default (input: string, output: string): Promise<string> =>
  new Promise(resolve => {
    console.log('audioConvert', input, output);

    // ffmpeg -i public/XXXX.wav -codec:a libmp3lame public/XXXX.mp3
    ffmpeg(input)
      .audioCodec('libmp3lame')
      .on('error', (err: Error) => {
        throw err;
      })
      .on('end', () => {
        resolve();
      })
      .saveToFile(output);
  });
