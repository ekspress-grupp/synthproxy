import { execFile } from 'child_process';
import { basename } from 'path';
import { filesDir, lexFile, lexdFile, voiceFile } from './path';
import { tmpName } from 'tmp';

const getVoiceFilePath = async (): Promise<string> =>
  new Promise<string>(resolve => {
    tmpName(
      { template: `${filesDir}/XXXXXX.wav` },
      (err: Error, filename: string) => {
        resolve(filename);
      },
    );
  });

/* tslint:disable:prettier */
const getSynthtsArguments = (inputFile: string, outputFile: string): string[] => {
  return [
    '-lex', lexFile,
    '-lexd', lexdFile,
    '-m', voiceFile,
    '-r', '1.1',
    '-f', inputFile,
    '-o', outputFile,
  ];
};
/* tslint:enable:prettier */

export default async (tmpFile: string): Promise<string> =>
  new Promise<string>(async (resolve, reject) => {
    const audioFile = await getVoiceFilePath();
    const args = getSynthtsArguments(tmpFile, audioFile);

    const child = execFile('synthts_et', args, (error, stdout, stderr) => {
      if (error) {
        console.error('synthts_et-exec', error);
        reject(error);
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      resolve(basename(audioFile));
    });
  });
