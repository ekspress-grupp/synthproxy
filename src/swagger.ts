import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

import { Express, Request, Response } from 'express';
import { safeLoad } from 'js-yaml';
import {
  serve as swaggerServe,
  setup as swaggerSetup,
} from 'swagger-ui-express';

const swaggerFile: string = path.join(__dirname, '../swagger.yml');

// FIXME: this value should perhaps not taken here but from some central config module
const ROOT_URL: string = String(
  process.env.ROOT_URL || 'http://localhost:3382/synth/v1',
);

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
    const redirectToSwaggerUI = (req: Request, res: Response) =>
      res.redirect('/synth/v1/swagger-ui');
    // redirect app root path url to swagger ui
    app.get('/synth/v1', redirectToSwaggerUI);
    // and root url himself also (this should be accessible only in development)
    app.get('/', redirectToSwaggerUI);
  }
};
