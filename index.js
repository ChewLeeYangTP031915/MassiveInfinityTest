const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const product = require('./routes/product');

const app = express();
const port = 3000;

const init = () => {
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/product', product.router);


  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });


  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  });
}

init();