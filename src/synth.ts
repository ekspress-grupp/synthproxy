import * as path from 'path';
import execTts from './execTts';
import writeToTmpFile from './writeToTmpFile';

export const filesDir = path.join(__dirname, '../public');

export default async (publicUrl: string, text: string): Promise<string> => {
  console.log('sync-text', text);
  const tmpFile = await writeToTmpFile(text);
  console.log('tmpFile', tmpFile);

  const fileName = await execTts(tmpFile);

  return `${publicUrl}/${fileName}`;
};
