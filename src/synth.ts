import { basename } from 'path';
import audioConvert from './audioConvert';
import { STORAGE_DRIVER } from './config';
import execTts from './execTts';
import getMeta from './getMeta';
import { filesDir } from './path';
import uploadToS3 from './uploadToS3';
import { tempfile, unlink, writefile } from './util';

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
  console.log('text', text);

  // output filename
  let outputFile: string;

  // create wav
  const [ttsFile, wavFile] = await Promise.all([
    tempfile(filesDir, 'txt'),
    tempfile(filesDir, 'wav'),
  ]);
  await writefile(ttsFile, text);
  await execTts(ttsFile, wavFile);
  await unlink(ttsFile);

  // optionally convert
  if (options.extension) {
    if (options.extension !== 'mp3') {
      throw new Error(
        `file extension '${options.extension}' not supported! (try mp3?)`,
      );
    }
    const mp3File = await tempfile(filesDir, options.extension);
    await audioConvert(wavFile, mp3File);
    await unlink(wavFile);
    outputFile = mp3File;
  } else {
    outputFile = wavFile;
  }

  const tempMeta = await getMeta(outputFile);
  const meta: IOutputMeta = {
    voice_name: 'tonu',
    audio_duration: tempMeta.duration,
    file_size: tempMeta.size,
    file_extension: tempMeta.file_extension,
  };

  const result = {
    meta,
    url: '',
  };

  if (STORAGE_DRIVER === 'S3') {
    result.url = await uploadToS3(outputFile);
    await Promise.all([unlink(outputFile), unlink(wavFile)]);
  } else {
    const fileName = basename(outputFile);
    result.url = `${publicUrl}/${fileName}`;
  }

  return result;
};
