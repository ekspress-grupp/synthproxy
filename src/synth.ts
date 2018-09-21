import * as path from 'path';
import audioConvert from './audioConvert';
import execTts from './execTts';
import uploadToS3 from './uploadToS3';
import writeToTmpFile from './writeToTmpFile';

export const filesDir = path.join(__dirname, '../public');
const STORAGE_DRIVER = String(process.env.STORAGE_DRIVER);

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

  if (STORAGE_DRIVER === 'S3') {
    const S3URL = await uploadToS3(fileName);
    return `${S3URL}`;
  }

  return `${publicUrl}/${fileName}`;
};
