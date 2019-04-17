// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var Grid = require('gridfs-stream');
var proxy       = require('http-proxy-middleware');
let cors=require('cors')
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({ ws: true });

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var BodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./app/config/localdatabase.js');
var webdir = require('./app/config/localconfig.js')

Grid.mongo = mongoose.mongo;
// configuration ===============================================================
mongoose.connect('mongodb://localhost/test'); // connect to our database

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
         res.send(200);
     } else {
         next();
     }
    });
    
//app.use(express.static(__dirname))
app.use(cors({
    origin:['http://localhost:7000','http://localhost:3000','http://albiziapp.reveries-project.fr','https://albiziapp.reveries-project.fr'],
    methods:['GET','POST'],
    credentials: true // enable set cookie
}
));
app.get('/socket.io/*', function(req, res) {
    //console.log("proxying GET request", req.url);
    proxy.web(req, res, { target: 'http://localhost:8081'});
  });
app.post('/socket.io/*', function(req, res) {
    //console.log("proxying POST request", req.url);
    proxy.web(req, res, { target: 'http://localhost:8081'});
  });
  app.post('/setupImages', function(req, res) {
    console.log("proxying setup Image", req.url);
    proxy.web(req, res, { target: 'http://localhost:8081'});
  });

  app.use(BodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}))
app.use(BodyParser.json({limit: '50mb'}))

    // required for passport
app.use(flash()); // use connect-flash for flash messages stored in session
var gfs = new Grid(mongoose.connection.db);
// routes ======================================================================
require('./app/route/staticRoutes.js')(app); // load our routes and pass in our app and fully configured passport
require('./app/route/fileRoutes.js')(app,gfs);
require('./app/route/sseMiddleWare.js')(app)
require('./app/route/documentRoutes.js')(app,gfs);

//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport);

// launch ======================================================================
app.listen(port);
console.log('Reveries server started on localhostkey: "value", ' + port);
