module.exports = function(app) {

    // Route for serving dynamic content (documents stored in mongodb)
    var Game = require('../models/game.js')

    app.get('/listActivities', function(req, res) {
       Game.find({},function(err,game){
        console.log(err)
        res.send(game)
       })
    });



}