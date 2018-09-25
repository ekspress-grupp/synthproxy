import * as bodyParser from 'body-parser';
import * as express from 'express';
import { hostname } from 'os';
import {
  httpServerTimeoutMsec,
  maxPostSize,
  MONOCHART_APP_VERSION,
  port,
  publicUrl,
} from './config';
import { filesDir } from './path';
import swagger from './swagger';
import synth from './synth';

const app: express.Express = express();

app.use(bodyParser.urlencoded({ limit: maxPostSize, extended: false }));
app.use(bodyParser.json({ limit: maxPostSize }));

// add swagger tooling
swagger(app, true);

app.get('/synth/v1/health_check', (req, res) => {
  res.send(`ok:${+new Date()}[${hostname()}][${MONOCHART_APP_VERSION}]`);
});

app.use('/synth/v1/files', express.static(filesDir));

// curl -X POST "http://localhost:3382/synth/v1/synth" --data "extension=mp3&text=test kala"
app.post('/synth/v1/synth', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'missing text' });
  }

  let urlAndMeta;
  try {
    urlAndMeta = await synth(publicUrl, text, req.body);
  } catch (e) {
    return res.status(500).json({ error: 'internal error' });
  }

  res.json({
    url: urlAndMeta.url,
    meta: urlAndMeta.meta,
  });
});

const server = app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
  console.log(`Audio content will be prefixed with ${publicUrl}`);
});

// set long timeout to avoid node http server killing connection
// @link https://github.com/expressjs/express/issues/3330
// it can take quite a long time time to make some bigger articles tts
server.setTimeout(httpServerTimeoutMsec);
