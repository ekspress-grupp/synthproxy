import * as bodyParser from 'body-parser';
import * as express from 'express';
import { hostname } from 'os';
import synth, { filesDir } from './synth';

const app: express.Express = express();
const port = process.env.PORT || 3382;
const publicUrl =
  process.env.PUBLIC_URL || `http://localhost:${port}/synth/v1/files`;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/synth/v1/health_check', (req, res) => {
  res.send(`ok:${+new Date()}[${hostname()}]`);
});

app.use('/synth/v1/files', express.static(filesDir));

// curl -X POST "http://localhost:3382/synth/v1/synth" --data "text=test kala"
app.post('/synth/v1/synth', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'missing text' });
  }

  let url;
  try {
    url = await synth(publicUrl, text);
  } catch (e) {
    return res.status(500).json({ error: 'internal error' });
  }

  res.json({
    url,
    // FIXME: remove - for testing!
    text,
  });
});

app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
  console.log(`Audio content will be prefixed with ${publicUrl}`);
});
