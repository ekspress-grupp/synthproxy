import * as bodyParser from 'body-parser';
import * as express from 'express';
import api from './api';
import {
  HTTP_MAX_POST_SIZE,
  HTTP_PORT,
  HTTP_SERVER_TIMEOUT_MSEC,
  PUBLIC_URL,
} from './config';

const app: express.Express = express();

app.use(bodyParser.urlencoded({ limit: HTTP_MAX_POST_SIZE, extended: false }));
app.use(bodyParser.json({ limit: HTTP_MAX_POST_SIZE }));

// add swagger tooling
api.swagger(app, true);

app.get('/synth/v1/health_check', api.health_check);
app.use('/synth/v1/files', api.files);

// curl -X POST "http://localhost:3382/synth/v1/synth" --data "extension=mp3&text=test kala"
app.post('/synth/v1/synth', api.synth);

const server = app.listen(HTTP_PORT, () => {
  console.log(`Server is now running on http://localhost:${HTTP_PORT}`);
  console.log(`Audio content will be prefixed with ${PUBLIC_URL}`);
});

// set long timeout to avoid node http server killing connection
// @link https://github.com/expressjs/express/issues/3330
// it can take quite a long time time to make some bigger articles tts
server.setTimeout(HTTP_SERVER_TIMEOUT_MSEC);
