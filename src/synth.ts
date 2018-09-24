import * as path from 'path';
import audioConvert from './audioConvert';
import execTts from './execTts';
import getMeta from './getMeta';
import uploadToS3 from './uploadToS3';
import writeToTmpFile from './writeToTmpFile';

export const filesDir = path.join(__dirname, '../public');
const STORAGE_DRIVER = String(process.env.STORAGE_DRIVER);

interface IoutputData {
  url: string;
  meta: {
    duration: number;
    size: number;
    voice: string;
  };
}

export interface ISynthOptions {
  extension?: string;
}

export default async (
  publicUrl: string,
  text: string,
  options: ISynthOptions = {},
): Promise<IoutputData> => {
  console.log('sync-text', text);
  const tmpFile = await writeToTmpFile(text);
  console.log('tmpFile', tmpFile);

  let fileName = await execTts(tmpFile);

  if (options.extension) {
    fileName = await audioConvert(fileName, options.extension);
  }
  const meta = await getMeta(fileName);

  if (STORAGE_DRIVER === 'S3') {
    const S3URL = await uploadToS3(fileName);
    return {
      url: S3URL.toString(),
      meta: {
        voice: 'tonu',
        duration: meta.duration,
        size: meta.size,
      },
    };
  }

  return {
    url: `${publicUrl}/${fileName}`,
    meta: { duration: meta.duration, size: meta.size, voice: 'tonu' },
  };
};
