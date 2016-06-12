module.exports = function(app) {

    // normal routes ===============================================================
    var User = require('../models/user.js');
    var Game = require('../models/game.js')

    app.get('/listActivities', function(req, res) {
       Game.find({},function(err,game){
        console.log(err)
        res.send(game)
       })
    });



}