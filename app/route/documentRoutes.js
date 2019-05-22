module.exports = function (app, gfs) {

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
  var UserData = require('../models/userData.js')
  var POI = require('../models/poi.js')
  var StaticMedia = require('../models/staticmedia.js')
  var FoliaExec = require('../models/foliaExec.js')
  var Folia = require('../models/folia.js')
  var YouTube = require('../models/youtube.js')

  var zbarimg = require('zbarimg')
  var spawn = require('child_process').spawn;
  var fs = require('fs');


 


 
  app.get('/api/userData', function (req, res) {
    UserData.find({})
      .deepPopulate(['badge','badge.media'])
      .exec(function (err, response) {
        res.send(response)
      })
  })

  app.post('/api/badges',function(req,res){
    let id = req.body.id
    let badge = req.body.badge
    UserData.findOne({
        userId: id
      })
    .exec(function(err,result){
      if(result){
        let hasBadge=result.badge.findIndex(val=>val._id==badge._id)
        if(hasBadge==-1){
          result.badge.push(badge._id)
          result.save()
          res.send({success:true})
        }
      }
      else{
        let userData = new UserData()
        userData.userId = id
        userData.badge.push(badge._id)

        userData.save(function (err) {
          console.log(err)
        })
        res.send({success:true})
      }
    })

  })
  app.post('/api/score', function (req, res) {
    let score = req.body.score
    let id = req.body.id
    let activityId = req.body.activityId
    UserData.findOne({
        userId: id
      })
      .exec(function (err, result) {
        if (result) {
          console.log(result)
          let index = result.score.findIndex(val => val.activity == activityId)
          console.log(index)
          if (index!=-1) {
            result.score.splice(index, 1, {
              activity: activityId,
              score: score
            })
          } else {
            result.score.push({
              activity: activityId,
              score: score
            })
          }
          console.log(result)
          result.save(function (err) {
            console.log(err)
          })
        } else {
          let userData = new UserData()
          userData.userId = id
          userData.score.push({
            activity: activityId,
            score: score
          })

          userData.save(function (err) {
            console.log(err)
          })
        }
        res.send({
          success: true
        })
      })
  })







  app.post('/api/qrscan', function (req, res) {
  
    var path = 'filetest.jpg'
      console.log(req.files.files)
      console.log(req.files.file)


      buffer = req.files.files.data;
      
    fs.open(path, 'w', function (err, fd) {
      if (err) {
        throw 'error opening file: ' + err;
      }

      fs.write(fd, buffer, 0, buffer.length, null, function (err) {
        if (err) throw 'error writing file: ' + err;
        fs.close(fd, function () {
          reduce = spawn('convert', ['-resize', '500x500', 'quality', '90', 'filetest.jpg', 'final.jpg']);
          reduce.on('exit', function (code) {
            zbarimg('final.jpg', function (error, qrcode) {
              console.log(error)
              console.log(qrcode)
              res.send(qrcode)
            });
          });

        })
      });
    });

  })
  app.get('/file/:id', function (req, res) {
    if (req.headers.range) {
      gfs.findOne({
        _id: req.params.id
      }, function (err, file) {
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

        req.on('error', function (err) {
          res.send(500, err);
        });
        readstream.on('error', function (err) {
          res.send(500, err);
        });
        readstream.pipe(res);
      });

    } else {


      gfs.findOne({
        _id: req.params.id
      }, function (err, file) {
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

        req.on('error', function (err) {
          res.send(500, err);
        });
        readstream.on('error', function (err) {
          res.send(500, err);
        });
        readstream.pipe(res);
      });



    }
  });

  app.get('/api/listActivities', function (req, res) {
    MLG.find({})
      .exec(function (err, mlgs) {
        res.send(mlgs)
      })
  });




}