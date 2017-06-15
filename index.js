const path = require('path');
const express = require('express');
const app = express();
const config = require('./server/config');
const routes = require('./server/routes');
const bodyParser = require('body-parser');


// Middlewares
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routing
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,'dist','index.html'));
});

const api = require('./server/routes')(app, express);
app.use('/api',api);

// Start Server
app.listen(config.port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening on ${config.base_url}`);
});