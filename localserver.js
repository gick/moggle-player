// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var Grid = require('gridfs-stream');
var proxy       = require('http-proxy-middleware');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var busboyBodyParser = require('busboy-body-parser');
var configDB = require('./app/config/localdatabase.js');
var webdir = require('./app/config/localconfig.js')

Grid.mongo = mongoose.mongo;
// configuration ===============================================================
mongoose.connect('mongodb://localhost/test'); // connect to our database

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());
//app.use(express.static(__dirname))


    // required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
var gfs = new Grid(mongoose.connection.db);
// routes ======================================================================
require('./app/route/staticRoutes.js')(app); // load our routes and pass in our app and fully configured passport
require('./app/route/fileRoutes.js')(app,gfs);
require('./app/route/sseMiddleWare.js')(app)
require('./app/route/documentRoutes.js')(app,gfs,passport);

//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport);

// launch ======================================================================
app.listen(port);
console.log('Reveries server started on localhostkey: "value", ' + port);
