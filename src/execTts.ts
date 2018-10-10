import { execFile } from 'child_process';
import { basename } from 'path';
import { tmpName } from 'tmp';
import { filesDir, lexdFile, lexFile, voiceFile } from './path';

// prettier-ignore
const getSynthtsArguments = (inputFile: string, outputFile: string): string[] => [
    '-lex', lexFile,
    '-lexd', lexdFile,
    '-m', voiceFile,
    '-r', '1.1',
    '-f', inputFile,
    '-o', outputFile,
  ];

export default async (textFile: string, audioFile: string): Promise<string> =>
  new Promise<string>(async (resolve, reject) => {
    const args = getSynthtsArguments(textFile, audioFile);

    execFile('synthts_et', args, (error, stdout, stderr) => {
      if (error) {
        console.error('synthts_et-exec', error);
        reject(error);
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      resolve();
    });
  });
