import audioConvert from './audioConvert';
import { STORAGE_DRIVER } from './config';
import execTts from './execTts';
import getMeta from './getMeta';
import uploadToS3 from './uploadToS3';
import writeToTmpFile from './writeToTmpFile';

interface IOutputMeta {
  voice_name: string;
  audio_duration: number;
  file_size: number;
  file_extension: string;
}

interface IOutputData {
  url: string;
  meta: IOutputMeta;
}

export interface ISynthOptions {
  extension?: string;
}

export default async (
  publicUrl: string,
  text: string,
  options: ISynthOptions = {},
): Promise<IOutputData> => {
  console.log('sync-text', text);
  const tmpFile = await writeToTmpFile(text);
  console.log('tmpFile', tmpFile);

  let fileName = await execTts(tmpFile);

  if (options.extension) {
    fileName = await audioConvert(fileName, options.extension);
  }
  const meta = await getMeta(fileName);

  const outputMeta: IOutputMeta = {
    voice_name: 'tonu',
    audio_duration: meta.duration,
    file_size: meta.size,
    file_extension: meta.file_extension,
  };

  if (STORAGE_DRIVER === 'S3') {
    const S3URL: string = await uploadToS3(fileName);
    return {
      url: S3URL.toString(),
      meta: outputMeta,
    };
  }

  return {
    url: `${publicUrl}/${fileName}`,
    meta: outputMeta,
  };
};
