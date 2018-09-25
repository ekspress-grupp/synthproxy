import { ROOT_URL } from '../config';
import { Express, Request, Response } from 'express';
import * as fs from 'fs';
import { safeLoad } from 'js-yaml';
import {
  setup as swaggerSetup,
  serve as swaggerServe,
} from 'swagger-ui-express';
import { URL } from 'url';
import { swaggerFile } from '../path';

const getSwaggerData = async () =>
  new Promise(resolve => {
    fs.readFile(swaggerFile, 'utf8', (err: Error, data: string) => {
      const json = safeLoad(data);
      // override host, schemes using current data
      const u = new URL(ROOT_URL);
      json.host = u.host;
      json.schemes = [u.protocol.replace(/:/, '')];
      resolve(json);
    });
  });

export default (app: Express, redirectRoot: boolean) => {
  app.use(
    '/synth/v1/swagger-ui',
    swaggerServe,
    swaggerSetup(null, {
      swaggerUrl: `${ROOT_URL}/swagger.json`,
    }),
  );

  app.get('/synth/v1/swagger.json', async (req: Request, res: Response) => {
    const swagger = await getSwaggerData();
    res.json(swagger);
  });

  if (redirectRoot) {
    const redirectToSwaggerUI = (req: Request, res: Response) => {
      res.redirect('/synth/v1/swagger-ui');
    };

    // redirect app root path url to swagger ui
    app.get('/synth/v1', redirectToSwaggerUI);
    // and root url himself also (this should be accessible only in development)
    app.get('/', redirectToSwaggerUI);
  }
};
