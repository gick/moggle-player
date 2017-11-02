module.exports = function(app) {

    var webdir = require('../config/localconfig.js')
    var express = require('express');
    // only one route to serve the static site
    app.use(express.static(webdir));


};
