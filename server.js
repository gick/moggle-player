var HTTP_PORT = 3102;
var HTTPS_PORT = 443;
var express  = require('express');
var app      = express();
var https=require('https')
var fs = require('fs')
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({ ws: true });
var busboyBodyParser = require('busboy-body-parser')
var cookieParser = require('cookie-parser');
var BodyParser   = require('body-parser');

var configDB = require('./app/config/database.js');

/////////////////////////////////////////////

var app = express()

app.use(BodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}))

Grid.mongo = mongoose.mongo;
mongoose.connect(configDB.url)
app.use(cookieParser()); // read cookies (needed for auth)
app.use(BodyParser.json({limit: '50mb'}))
app.use(busboyBodyParser())
var gfs = new Grid(mongoose.connection.db);
app.post('/api/setupImages', function(req, res) {
  proxy.web(req, res, { target: 'http://localhost:8081'});
});
proxy.on('error', function(e) {
  console.log(e)
});
proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

//
// Listen for the `open` event on `proxy`.
//
proxy.on('open', function (proxySocket) {
  // listen for messages coming FROM the target here
  proxySocket.on('data', hybiParseAndLogMessage);
});

//
// Listen for the `close` event on `proxy`.
//
proxy.on('close', function (res, socket, head) {
  // view disconnected websocket connections
  console.log('Client disconnected');
});

require('./app/route/staticRoutes.js')(app); // load satic routes 
require('./app/route/documentRoutes.js')(app,gfs); // load routes to services

var secureServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/games.reveries-project.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/games.reveries-project.fr/cert.pem')
  }, app)
  .listen(HTTPS_PORT, function () {
    console.log('Secure Server listening on port ' + HTTPS_PORT);
});
