import * as bodyParser from 'body-parser';
import * as express from 'express';
import { hostname } from 'os';
import synth from './synth';

const app: express.Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/synth/v1/health_check', (req, res) => {
  res.send(`ok:${+new Date()}[${hostname()}]`);
});

// curl -X POST "http://localhost:3000/synth/v1/synth" --data "text=test kala"
app.post('/synth/v1/synth', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'missing text' });
  }

  let url;
  try {
    url = await synth(text);
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
});
