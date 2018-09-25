import { unlink } from 'fs';
import { contentType } from 'mime-types';
import { Client } from 'minio';
import { join as joinPath } from 'path';
import { filesDir } from './path';

import {
  S3_ACCESS_KEY,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_PORT,
  S3_SECRET_KEY,
  S3_USE_SSL,
} from './config';

let client: Client;

export default async (fileName: string) => {
  if (!client) {
    client = new Client({
      endPoint: S3_ENDPOINT,
      port: S3_PORT,
      useSSL: S3_USE_SSL,
      accessKey: S3_ACCESS_KEY,
      secretKey: S3_SECRET_KEY,
    });
  }

  const fileToUpload = joinPath(filesDir, fileName);
  const metaData = {
    'Content-Type': contentType(fileName),
  };
  const d = new Date();
  const s3FilePath = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}/${d.getHours()}/${d.getMinutes()}${d.getMilliseconds()}-${fileName}`;
  console.log('s3FilePath', s3FilePath);

  await new Promise(resolve => {
    client.fPutObject(
      S3_BUCKET,
      s3FilePath,
      fileToUpload,
      metaData,
      (err: any) => {
        if (err) {
          console.log('upload error', err);
          throw err;
        }
        resolve();
      },
    );
  });

  unlink(fileToUpload, (err: Error) => {
    if (err) {
      throw err;
    }
    console.log('removed local file', fileToUpload);
  });

  return new Promise<string>((resolve, reject) => {
    client.presignedUrl('GET', S3_BUCKET, s3FilePath, (err, presignedUrl) => {
      if (err) reject(err);
      resolve(presignedUrl);
    });
  });
};
