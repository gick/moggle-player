module.exports = function(app, gfs) {
  const {
    sse
  } = require('@toverux/expresse');
  var waterfall = require('async').waterfall
  var ObjectId = require('mongoose').Types.ObjectId;
  var fs = require('fs')
  var request = require('request')

  var ProxySSE = require('./proxySSE')
  var FoliaExec = require('../models/foliaExec.js')

  app.get('/uploadfiles/:id', function(req, res) {
    FoliaExec.findOne({
      _id: ObjectId(req.params.id)
    }, function(err, foliaInstance) {
      var foliaForm = {
        leafId: foliaInstance.leaf,
        coloriageId: foliaInstance.coloriage,
        leaf: {
          value: gfs.createReadStream({
            _id: foliaInstance.leaf
          }),
          options: {
            filename: foliaInstance.leaf,
            contentType: foliaInstance.leafContentType,
            length: foliaInstance.leafLength,
            contentLength: foliaInstance.leafLength,
            knownLength: foliaInstance.leafLength
          }
        },
        coloriage: {
          value: gfs.createReadStream({
            _id: foliaInstance.coloriage
          }),
          options: {
            filename: foliaInstance.coloriage,
            contentType: foliaInstance.coloriageContentType,
            length: foliaInstance.coloriageLength,
            contentLength: foliaInstance.coloriageLength,
            knownLength: foliaInstance.coloriageLength
          }


        }
      }
      request.post({
        url: 'http://localhost:8081/images',
        formData: foliaForm
      }, function optionalCallback(err, httpResponse, body) {
        if (err) {
          res.status(500).send(err)
        }
        res.status(200).send({
          operation: 'upload',
          success: true
        });
      });

    });
  })

  app.get('/execFolia/:id', sse( /* options */ ), (req, res) => {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'No folia Id provided'
      })
    }
    FoliaExec.findById(req.params.id)
      .exec(function(err, foliaInstance) {
        var url = 'http://localhost:8081/result?leafId=' + foliaInstance.leaf + '&maskId=' + foliaInstance.coloriage
        var proxySSE = ProxySSE()
        proxySSE.stream(url)


        proxySSE.emitter.on('message', (event) => {
          //=> Data messages (no event name, but defaults to 'message' in the browser).
          foliaInstance.stdout.push(event)

          res.sse.data(event);
          //=> Named event + data (data is mandatory)
          //=> Comment, not interpreted by EventSource on the browser - useful for debugging/self-documenting purposes.
          //=> In data() and event() you can also pass an ID - useful for replay with Last-Event-ID header.
        });

        // (not recommended) to force the end of the connection, you can still use res.end()
        // beware that the specification does not support server-side close, so this will result in an error in EventSource.
        // prefer sending a normal event that asks the client to call EventSource#close() itself to gracefully terminate.
        proxySSE.emitter.on('procterm', (event) => {
          foliaInstance.save(function(err) {
            if (err) {
              return res.send(err)
            }
            res.sse.data(event);
            res.send()
          })
        })

      });
  });
  app.get('/populateResult/:id', function(req, res) {
    FoliaExec.findOne({
        _id: req.params.id
      })
      .exec(function(err, foliaInstance) {
        let id = foliaInstance.coloriage + foliaInstance.leaf

        request('http://localhost:8081/stringResult/' + id,(err,response,body)=>{
          foliaInstance.result=body
          populateMask(res,foliaInstance)
        })
      })
  })

var populateMask=function(res,foliaInstance){
        let id = foliaInstance.coloriage + foliaInstance.leaf

        let maskWriteStream = gfs.createWriteStream({
          filename: foliaInstance.id + '.png',
          contentType: 'image/png'
        })

        maskWriteStream.on('close', (file) => {

          foliaInstance.maskFileId = file._id
          foliaInstance.save(function(err){
            if(err){
             return  res.send(err)
            }
            res.send({success:true,resource:foliaInstance})
          })

        })
        request('http://localhost:8081/mask/' + id).pipe(maskWriteStream)

  }




  app.get('/populateMask/:id', function(req, res) {
    FoliaExec.findOne({
        _id: req.params.id
      })
      .exec(function(err, foliaInstance) {
        let id = foliaInstance.coloriage + foliaInstance.leaf
        console.log(id)
        let maskWriteStream = gfs.createWriteStream({
          filename: id + '.png',
          contentType: 'image/png'
        })

        maskWriteStream.on('close', (file) => {

          foliaInstance.maskFileId = file._id
          foliaInstance.save(function(err){
            if(err){
              res.status(500).send(err)
            }
            res.send({success:true,resource:foliaInstance})
          })

        })
        request('http://localhost:8081/mask/' + id).pipe(maskWriteStream)

  })})


}
