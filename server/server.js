require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const engine = require('./engine');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// static routes
app.use('/', express.static('./public/start'));
app.use('/:clientId', express.static('./public'));

// api route
app.get('/api/:clientId', async (req, res) => {
  res.json(await engine.getTimes(req.params.clientId, req.query.from));
});

app.listen(PORT, () => {
  logger.log(`ready on http://localhost:${PORT}`);
});
