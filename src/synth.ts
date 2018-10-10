import audioConvert from './audioConvert';
import execTts from './execTts';
import getMeta from './getMeta';
import uploadToS3 from './uploadToS3';
import util from './util';
import { STORAGE_DRIVER } from './config';
import { basename } from 'path';
import { filesDir } from './path';

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
  const ttsFile = await util.tempfile(filesDir, 'txt');
  const wavFile = await util.tempfile(filesDir, 'wav');
  await util.writefile(ttsFile, text);
  await execTts(ttsFile, wavFile);
  await util.unlink(ttsFile);

  // optionally convert
  if (options.extension) {
    if (options.extension !== 'mp3') {
      throw new Error(
        `file extension '${options.extension}' not supported! (try mp3?)`,
      );
    }
    const mp3File = await util.tempfile(filesDir, options.extension);
    await audioConvert(wavFile, mp3File);
    console.log(mp3File);
    await util.unlink(wavFile);
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
    await Promise.all([util.unlink(outputFile), util.unlink(wavFile)]);
  } else {
    const fileName = basename(outputFile);
    result.url = `${publicUrl}/${fileName}`;
  }

  return result;
};
