var HTTP_PORT = 3102;
var HTTPS_PORT = 443;
var express  = require('express');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var busboyBodyParser = require('busboy-body-parser');

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var configDB = require('./app/config/database.js');

/////////////////////////////////////////////

var app = express();

// Route all Traffic to Secure Server
// Order is important (this should be the first route)

//#######HTTPS 

/*app.all('*', function(req, res, next){
  if (req.secure) {
    return next();
  };
  //res.redirect('https://localhost:'+HTTPS_PORT+req.url);
   res.redirect('https://'+req.hostname+':'+HTTPS_PORT+req.url);
});
*/
// H
var configDB = require('./app/config/database.js');
Grid.mongo = mongoose.mongo;
// configuration ===============================================================
mongoose.connect(configDB[0].url); // connect to our database
var gfs = new Grid(mongoose.connection.db);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());


// basic conf
// routes ======================================================================
require('./app/route/staticRoutes.js')(app); // load satic routes 
require('./app/route/documentRoutes.js')(app,gfs); // load routes to services
require('./app/route/fileRoutes.js',app,gfs)

/////////////////////////////////////////////
// Setup Servers

// HTTPS
/*
var secureServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/reveries-project.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/reveries-project.fr/cert.pem')
  }, app)
  .listen(HTTPS_PORT, function () {
    console.log('Secure Server listening on port ' + HTTPS_PORT);
});
*/
app.listen(3000)
