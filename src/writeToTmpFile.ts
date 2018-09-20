import { writeFile } from 'fs';
import * as tmp from 'tmp';

/**
 * @return {string}
 * @param {string} text
 */
export default async (text: string): Promise<string> => {
  const tmpFile = await new Promise<string>(resolve => {
    tmp.file((err: Error, file: string) => {
      if (err) {
        throw err;
      }
      resolve(file);
    });
  });
  await new Promise(resolve => {
    writeFile(tmpFile as any, text, (err: Error) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
  return tmpFile;
};
