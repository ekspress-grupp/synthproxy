import * as bodyParser from 'body-parser';
import * as express from 'express';
import api from './api';
import { httpServerTimeoutMsec, maxPostSize, port, publicUrl } from './config';

const app: express.Express = express();

app.use(bodyParser.urlencoded({ limit: maxPostSize, extended: false }));
app.use(bodyParser.json({ limit: maxPostSize }));

// add swagger tooling
api.swagger(app, true);

app.get('/synth/v1/health_check', api.health_check);
app.use('/synth/v1/files', api.files);

// curl -X POST "http://localhost:3382/synth/v1/synth" --data "extension=mp3&text=test kala"
app.post('/synth/v1/synth', api.synth);

const server = app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
  console.log(`Audio content will be prefixed with ${publicUrl}`);
});

// set long timeout to avoid node http server killing connection
// @link https://github.com/expressjs/express/issues/3330
// it can take quite a long time time to make some bigger articles tts
server.setTimeout(httpServerTimeoutMsec);
