import { contentType } from 'mime-types';
import { Client } from 'minio';
import { basename } from 'path';

import {
  S3_ACCESS_KEY,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_PORT,
  S3_SECRET_KEY,
  S3_USE_SSL,
} from './config';

let client: Client;

export default async (fileToUpload: string) => {
  if (!client) {
    client = new Client({
      endPoint: S3_ENDPOINT,
      port: S3_PORT,
      useSSL: S3_USE_SSL,
      accessKey: S3_ACCESS_KEY,
      secretKey: S3_SECRET_KEY,
    });
  }

  const fileName = basename(fileToUpload);
  const metaData = {
    'Content-Type': contentType(fileToUpload),
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

  return new Promise<string>((resolve, reject) => {
    client.presignedUrl('GET', S3_BUCKET, s3FilePath, (err, presignedUrl) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(presignedUrl);
    });
  });
};
