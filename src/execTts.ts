import { execFile } from 'child_process';
import * as path from 'path';
import { tmpName } from 'tmp';

const pubDir = path.join(__dirname, '../public');

const getVoiceFilePath = async (): Promise<string> =>
  new Promise<string>(resolve => {
    tmpName(
      { template: `${pubDir}/XXXXXX.mp3` },
      (err: Error, filename: string) => {
        resolve(filename);
      },
    );
  });

/* tslint:disable:prettier */
const getSynthtsArguments = (inputFile: string, outputFile: string): string[] => {
  return [
    '-lex', 'dct/et.dct',
    '-lexd', 'dct/et3.dct',
    '-m', 'htsvoices/eki_et_tnu.htsvoice',
    '-r', '1.1',
    '-f', inputFile,
    '-o', outputFile,
  ];
};
/* tslint:enable:prettier */

export default async (tmpFile: string): Promise<string> =>
  new Promise<string>(async resolve => {
    const voiceFile = await getVoiceFilePath();
    const args = getSynthtsArguments(tmpFile, voiceFile);

    const child = execFile('synthts_et', args, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      resolve(path.basename(voiceFile));
    });
  });