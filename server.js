// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();


// basic config
var PORT = 8080;
// routes ======================================================================
require('./app/route/staticRoutes.js')(app); // load satic routes 
require('./app/route/documentRoutes.js')(app); // load routes to services

// launch ======================================================================
//server = https.createServer(https_options, app).listen(PORT);
app.listen(PORT)
console.log('Game server running on localhost:' + PORT);
