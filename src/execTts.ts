import { exec } from 'child_process';
import * as path from 'path';

import * as tmp from 'tmp';

const pubDir = path.join(__dirname, '../public');

const getVoiceFilePath = async (): Promise<string> =>
  new Promise<string>(resolve => {
    tmp.tmpName(
      { template: `${pubDir}/XXXXXX.mp3` },
      (err: Error, filename: string) => {
        resolve(filename);
      },
    );
  });

export default async (tmpFile: string): Promise<string> =>
  new Promise<string>(async resolve => {
    const voiceFile = await getVoiceFilePath();
    exec(`sh -c "sleep 3 && date > ${voiceFile}"`, (err, stdout, stderr) => {
      if (err) {
        throw err;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      resolve('');
    });
  });
