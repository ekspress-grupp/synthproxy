import { tmpName } from 'tmp';

export default async (directory: string, extension = 'tmp'): Promise<string> =>
  new Promise<string>(resolve => {
    tmpName(
      { template: `${directory}/XXXXXX.${extension}` },
      (err: Error, filename: string) => {
        resolve(filename);
      },
    );
  });
