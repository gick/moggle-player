// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var busboyBodyParser = require('busboy-body-parser');

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

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


// basic config
var PORT = 8000;
// routes ======================================================================
require('./app/route/staticRoutes.js')(app); // load satic routes 
require('./app/route/documentRoutes.js')(app,gfs); // load routes to services
require('./app/route/fileRoutes.js',app,gfs)
// launch ======================================================================
//server = https.createServer(https_options, app).listen(PORT);
app.listen(PORT)
console.log('Game server running on localhost:' + PORT);
