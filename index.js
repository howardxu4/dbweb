const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const mroutor = require('./modules/mrout')

  app.use(bodyParser.json({extended : true}));

  app.use(express.static('public'));

  app.use('/', mroutor)

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(3000, () => console.log('Example app listening on port 3000!'))
