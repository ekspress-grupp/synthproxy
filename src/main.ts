import * as express from 'express';
import * as bodyParser from 'body-parser';

const app: express.Express = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/synth/v1/health_check', (req, res) => {
  res.send(`ok:${+new Date()}[${require('os').hostname()}]`);
});

app.get('/', (req, res) => {
  res.send(`hello world!`);
});

app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});
