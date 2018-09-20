import * as express from 'express';

const app: express.Express = express();

const port = process.env.PORT || 3000;

app.get('/health_check', (req, res) => {
  res.send(`ok:${+new Date()}[${require('os').hostname()}]`);
});

app.get('/', (req, res) => {
  res.send(`hello world!`);
});

app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});
