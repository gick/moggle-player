module.exports = function(app, gfs) {

    // Route for serving dynamic content (documents stored in mongodb)
    var Game = require('../models/game.js')
    var MLG = require('../models/mlg.js')
    var MCQ = require('../models/mcq.js')
    var FreeText = require('../models/freetext.js')
    var POI = require('../models/poi.js')
    var StaticMedia = require('../models/staticmedia.js')

    app.get('/listAllFiles', function(req,
        res) {
        console.log(req)
        gfs.files.find({}).toArray(function(err, files) {
            res.send(files);
        })
    });

    app.get('/listActivities', function(req, res) {
        MLG.find({}, function(err, game) {
            console.log(err)
            res.send(game)
        })
    });
    //handle reception lgof a complete game
    app.post('/mlg', function(req, res) {
        var newMLG = new MLG();
        var toSend = { activityName: req.body.activityName }
    })


    app.get('/unitGame/:id', function(req, res) {
        Game.find({ '_id': req.params.id, }, function(err, game) {
            res.send(game);
        })

    })
    app.get('/freetext/:id', function(req, res) {
        FreeText.find({ '_id': req.params.id, }, function(err, game) {
            res.send(game);
        })

    })
    app.get('/poi/:id', function(req, res) {
        POI.find({ '_id': req.params.id, }, function(err, pois) {
            res.send(pois);
        })

    })


    app.get('/mcq/:id', function(req, res) {
        MCQ.find({ '_id': req.params.id, }, function(err, game) {
            res.send(game);
        })

    })

    app.get('/staticmedia/:id', function(req, res) {
        console.log(req.params.id)
        console.log(req.params)
        StaticMedia.find({ '_id': req.params.id, }, function(err, staticMedia) {
            res.send(staticMedia);
        })

    })




    app.get('/file/:id', function(req, res) {
        console.log(req)
        if (req.headers.range) {
            gfs.findOne({
                _id: req.params.id
            }, function(err, file) {
                if (!file) {
                    res.send({
                        success: false
                    });
                    return;
                }
                var parts = req.headers['range'].replace(/bytes=/, '').split('-');
                var partialstart = parts[0];
                var partialend = parts[1];

                var start = parseInt(partialstart, 10);
                var end = partialend ? parseInt(partialend, 10) : file.length - 1;
                var chunksize = (end - start) + 1;
                res.status(206)
                res.set({
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': file.contentType,
                });

                var readstream = gfs.createReadStream({
                    _id: req.params.id,
                    range: {
                        startPos: start,
                        endPos: end
                    }
                });

                req.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.pipe(res);
            });

        } else {


            gfs.findOne({
                _id: req.params.id
            }, function(err, file) {
                if (!file) {
                    res.send({
                        success: false
                    });
                    return;
                }

                var readstream = gfs.createReadStream({
                    _id: req.params.id
                });
                res.set('Content-Type', file.contentType);
                res.set('Content-Length', file.length);

                req.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.pipe(res);
            });



        }
    });


}
