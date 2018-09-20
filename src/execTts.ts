import { execFile } from 'child_process';
import * as path from 'path';
import { tmpName } from 'tmp';

import { filesDir } from './synth';

const synthtsDir = '/usr/share/synthts';
// const synthtsDir = '.';
const lexFile = path.join(synthtsDir, 'dct/et.dct');
const lexdFile = path.join(synthtsDir, 'dct/et3.dct');
const voiceFile = path.join(synthtsDir, 'htsvoices/eki_et_tnu.htsvoice');

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
  new Promise<string>(async resolve => {
    const audioFile = await getVoiceFilePath();
    const args = getSynthtsArguments(tmpFile, audioFile);

    const child = execFile('synthts_et', args, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      resolve(path.basename(audioFile));
    });
  });
