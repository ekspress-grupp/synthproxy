import * as path from 'path';
import audioConvert from './audioConvert';
import execTts from './execTts';
import writeToTmpFile from './writeToTmpFile';

export const filesDir = path.join(__dirname, '../public');

export interface ISynthOptions {
  extension?: string;
}

export default async (
  publicUrl: string,
  text: string,
  options: ISynthOptions = {},
): Promise<string> => {
  console.log('sync-text', text);
  const tmpFile = await writeToTmpFile(text);
  console.log('tmpFile', tmpFile);

  let fileName = await execTts(tmpFile);

  if (options.extension) {
    fileName = await audioConvert(fileName, options.extension);
  }

  return `${publicUrl}/${fileName}`;
};
