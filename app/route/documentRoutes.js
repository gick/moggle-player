module.exports = function(app, gfs, passport) {

  // Route for serving dynamic content (documents stored in mongodb)
  var base64Img = require('base64-img');
  var request = require('request')
  var Game = require('../models/game.js')
  var User = require('../models/user.js')
  var MLG = require('../models/mlg.js')
  var MCQ = require('../models/mcq.js')
  var InventoryItem = require('../models/inventoryItem.js')
  var Badge = require('../models/badge.js')
  var FreeText = require('../models/freetext.js')
  var POI = require('../models/poi.js')
  var StaticMedia = require('../models/staticmedia.js')
  var FoliaExec = require('../models/foliaExec.js')
  var zbarimg = require('zbarimg')
  var spawn = require('child_process').spawn;
  var fs = require('fs');
  app.get('/profile', function(req, res) {
    if (req.isAuthenticated()) {
      res.json({
        success: true,
        user: req.user
      })
    } else {
      res.json({
        success: false
      })
    }
  });
  app.get('/foliaInstance/:id',function(req,res){
    FoliaExec.findOne({_id:req.params.id})
      .exec(function(err,foliaInstance){
        if(err){res.status(400).send('Instance not found')}
        res.status(200).send(foliaInstance)
      })
  })
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
            res.send({
              success: false
            })
          } else res.send({
            success: true
          })

        })
      } else {
        toUpdate.scores.push({
          id: req.body.id,
          score: req.body.score
        });
        toUpdate.save(function(err) {
          if (err) {
            console.log(err)
            res.send({
              success: false
            })
          } else res.send({
            success: true
          })

        })
      }
    }

  });

  app.post('/leaf', function(req, res) {
    var part = req.files;
    var writestream = gfs.createWriteStream({
      mode: 'w',
      content_type: part.file.mimetype,
      metadata: {}
    });
    writestream.write(part.file.data);

    writestream.on('close', function(fileInfo) {
      var foliaExec = new FoliaExec()
      foliaExec.leaf = fileInfo._id
      foliaExec.leafFilename = fileInfo._id
      foliaExec.leafContentType = fileInfo.contentType
      foliaExec.leafLength = fileInfo.length
      foliaExec.save(function(err) {
        if (err) {
          res.send({
            success: false
          })
        } else res.send({
          success: true,
          resource: foliaExec,
          operation: 'create'
        })
      })

    })
    writestream.end();

  });

  app.post('/coloriage/:id', function(req, res) {
    if (!req.params.id) {
      res.send({
        success: false,
        operation: 'create',
        message: 'No folia id provided'
      })
    }
    var filepath = base64Img.imgSync(req.body.dataURI, '/tmp', req.params.id +Date.now());

    var writestream = gfs.createWriteStream({
    mode: 'w', // default value: w

    //any other options from the GridStore may be passed too, e.g.:

    content_type: 'image/png', // For content_type to work properly, set "mode"-option to "w" too!

});

    fs.createReadStream(filepath).pipe(writestream)


    writestream.on('close', function(fileInfo) {
      FoliaExec.findById(req.params.id)
        .exec(function(err, result) {
          if (err) {
            res.send({
              success: false
            })
          } else {
            result.coloriage = fileInfo._id
            result.coloriageFilename = fileInfo._id
            result.coloriageContentType = fileInfo.contentType
            result.coloriageLength = fileInfo.length
            result.save(function(err) {
              if (err) {
                res.send({
                  success: false
                })
              } else res.send({
                success: true,
                resource: result,
                operation: 'update'
              })
            })
          }

        })
        writestream.end();

    })

  });




  app.post('/userfile', function(req, res) {
    var part = req.files;
    var writestream = gfs.createWriteStream({
      filename: part.file.name,
      mode: 'w',
      content_type: part.file.mimetype,
      metadata: {}
    });
    writestream.write(part.file.data);

    writestream.on('close', function(fileInfo) {
      res.send({
        _id: fileInfo._id,
        success: true,

      });

    })
    writestream.end();

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
      var i = 0;
      while ((toUpdate.badges[i] != req.body.id) && (i < toUpdate.badges.length)) {
        i++;
      }
      if (toUpdate.badges[i] == req.body.id) {
        res.send({
          success: false,
          message: "Badge already acquired"
        });
      } else {
        console.log("Adding badge " + req.body.id)
        i += 1;
        toUpdate.badges.push(req.body.id);
        toUpdate.save(function(err) {
          if (err) {
            console.log(err)
            return 500;
          }
          res.send({
            success: true,
            message: "badge added"
          })
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
        var badgeArray = []
        for (var i = 1; i < user.badges.length; i++) {
          var badgeTemp = {
            id: user.badges[i]
          }
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
    MLG.find({})
      .deepPopulate(['unitGames', 'badge', 'badge.media', 'startpage', 'unitGames.startMedia', 'unitGames.feedbackMedia', 'unitGames.freetextActivities', 'unitGames.mcqActivities', 'unitGames.mcqActivities.media', 'unitGames.inventoryItem', 'unitGames.inventoryItem.media', 'unitGames.inventoryItem.inventoryDoc', 'unitGames.POI'])
      .exec(function(err, mlgs) {
        res.send(mlgs)
      })
  });
  //handle reception lgof a complete game
  app.post('/mlg', function(req, res) {
    var newMLG = new MLG();
    var toSend = {
      activityName: req.body.activityName
    }
  })


  app.get('/unitgame/:id', function(req, res) {
    Game.find({
        '_id': req.params.id,
      })
      .populate('startMedia')
      .populate('feedbackMedia')
      .populate('POI')
      .populate('inventoryItem')
      .exec(function(err, game) {
        res.send(game);
      })


  })

  app.get('/inventory/:id', function(req, res) {
    InventoryItem.find({
        '_id': req.params.id,
      })
      .populate('media')
      .populate('inventoryDoc')
      .exec(function(err, results) {
        res.send(results)
      })
  })

  app.get('/badge/:id', function(req, res) {
    Badge.find({
      '_id': req.params.id,
    }, function(err, badge) {
      res.send(badge);
    })

  })

  app.get('/freetext/:id', function(req, res) {
    FreeText.find({
      '_id': req.params.id,
    }, function(err, game) {
      res.send(game);
    })

  })
  app.get('/poi/:id', function(req, res) {
    POI.find({
      '_id': req.params.id,
    }, function(err, pois) {
      res.send(pois);
    })

  })

  app.get('/question/:id', function(req, res) {
    FreeText.find({
      '_id': req.params.id,
    }, function(err, game) {
      if (game && game[0]) {
        console.log("game ")
        console.log(game)
        res.send(game)
      } else
        MCQ.find({
          '_id': req.params.id,
        }, function(err2, game2) {
          console.log("freetext")
          console.log(game2)
          res.send(game2);
        })


    })

  })

  app.get('/mcq/:id', function(req, res) {
    MCQ.find({
      '_id': req.params.id,
    }, function(err, game) {
      res.send(game);
    })

  })

  app.get('/staticmedia/:id', function(req, res) {
    console.log(req.params.id)
    console.log(req.params)
    StaticMedia.find({
      '_id': req.params.id,
    }, function(err, staticMedia) {
      res.send(staticMedia);
    })

  })




  app.get('/file/:id', function(req, res) {
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
