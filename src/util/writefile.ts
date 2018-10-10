import { writeFile } from 'fs';

/**
 * @param {string} path
 * @param {string} contents
 * @return {string}
 */
export default async (path: string, contents: string): Promise<string> => {
  await new Promise(resolve => {
    writeFile(path as any, contents, (err: Error) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
  return path;
};
