module.exports = function(app, gfs,passport) {

    // Route for serving dynamic content (documents stored in mongodb)
    var Game = require('../models/game.js')
    var User = require('../models/user.js')
    var MLG = require('../models/mlg.js')
    var MCQ = require('../models/mcq.js')
    var InventoryItem=require('../models/inventoryItem.js')
    var Badge = require('../models/badge.js')
    var FreeText = require('../models/freetext.js')
    var POI = require('../models/poi.js')
    var StaticMedia = require('../models/staticmedia.js')
    var zbarimg = require('zbarimg')
    var spawn = require('child_process').spawn;
    var fs = require('fs');
    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            res.json({ success: true, user: req.user })
        } else {
            res.json({ success: false })
        }
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // if authentification succeeds, /profile will return user info
        failureRedirect: '/profile', // if authentification fails, /profile will return {success:false}
        failureFlash: true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/user', function(req, res) {
	if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }

	for (var i = 0; i < user.scores.length; i++) {
		if (user.scores[i].id == req.body.id) {
			toUpdate.scores[i].score = req.body.score;
			toUpdate.save(function(err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false })
                        } else res.send({ success: true })

                	})
		} else {
		toUpdate.scores.push({id:req.body.id, score:req.body.score});
		toUpdate.save(function(err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false })
                        } else res.send({ success: true })

        		})
		}
	}
	
    });

    app.post('/user/badges', function(req, res) {
		if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
		User.findById(req.user._id, function(err, toUpdate) {
			console.log("User found, request id : " + req.body.id);
			if (!toUpdate) {
                    console.log("Err, user with id " + req.user._id + " does not exists")
               }
			var i=0;
			while ((toUpdate.badges[i] != req.body.id) && (i < toUpdate.badges.length)) {
				i++;
			}
            if (toUpdate.badges[i] == req.body.id) {
				res.send({success: false, message: "Badge already acquired"});
			} else {
				console.log("Adding badge " + req.body.id)
				i += 1;
				toUpdate.badges.push(req.body.id);
				toUpdate.save(function(err) {
            		if (err) {
                		console.log(err)
                		return 500;
            		}
            		res.send({success: true, message: "badge added"})
        		});
			}
        })
    });

    app.get('/user/badges', function(req, res) {
		if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        } else {
			User.findById(req.user._id, function(err, user) {
				var badgeArray=[]
				for(var i=1;i<user.badges.length;i++){
					var badgeTemp={id:user.badges[i]}
					badgeArray.push(badgeTemp)
				}
				res.send(badgeArray)
        	})
		}
    });

    app.post('/qrscan', function(req, res) {
        var path = 'filetest.jpg',
            buffer = req.files.file.data;

        fs.open(path, 'w', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }

            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {
                    reduce = spawn('convert', ['-resize', '500x500', 'quality', '90', 'filetest.jpg', 'final.jpg']);
                    reduce.on('exit', function(code) {
                        zbarimg('final.jpg', function(error, qrcode) {
                            console.log(error)
                            console.log(qrcode)
                            res.send(qrcode)
                        });
                    });

                })
            });
        });

    })

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
    app.get('/inventory/:id', function(req, res) {
        InventoryItem.find({ '_id': req.params.id, }, function(err, inventoryItem) {
            res.send(inventoryItem);
        })

    })

    app.get('/badge/:id', function(req, res) {
        Badge.find({ '_id': req.params.id, }, function(err, badge) {
            res.send(badge);
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

    app.get('/question/:id', function(req, res) {
        FreeText.find({ '_id': req.params.id, }, function(err, game) {
            if (game && game[0]) {
                console.log("game ")
                console.log(game)
                res.send(game)
            } else
                MCQ.find({ '_id': req.params.id, }, function(err2, game2) {
                    console.log("freetext")
                    console.log(game2)
                    res.send(game2);
                })


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
