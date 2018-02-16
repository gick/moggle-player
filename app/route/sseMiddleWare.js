module.exports = function(app,gfs) {
  const {
    sse
  } = require('@toverux/expresse');
  var ObjectId = require('mongoose').Types.ObjectId;
  var fs = require('fs')
  var request = require('request')

  var proxySSE = require('./proxySSE')()
  var FoliaExec = require('../models/foliaExec.js')

  app.get('/uploadfiles/:id', function(req, res) {

    FoliaExec.findOne({
      _id: ObjectId(req.params.id)
    }, function(err, foliaInstance) {
      var foliaForm = {
        leafId: foliaInstance.leaf,
        coloriageId: foliaInstance.coloriage,
        leaf: {
          value : gfs.createReadStream({
            _id: foliaInstance.leaf
          }),
          options: {
            filename: foliaInstance.leafFilename,
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
            filename: foliaInstance.coloriageFilename,
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
          return res.status(500).send(err)
        }
        return res.status(200).send({
          operation: 'upload',
          success: true
        });
      });

    });
  })

  var populateFoliaResult=(foliaInstance)=>{
    console.log(foliaInstance)
    foliaInstance.save(function(err){
      console.log(err)
    let id = foliaInstance.coloriage +foliaInstance.leaf
    request('http://localhost:8081/result/' + id).pipe(fs.createWriteStream('file1'))
    request('http://localhost:8081/mask/' + id).pipe(fs.createWriteStream('file2'))
  })}


  app.get('/execFolia/:id', sse( /* options */ ), (req, res) => {
    if(!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'No folia Id provided'
      })
    }
    FoliaExec.findById(req.params.id)
      .exec(function(err, foliaInstance) {
        var url='http://localhost:8081/result?leafId=' + foliaInstance.leaf +'&maskId='+ foliaInstance.coloriage
        proxySSE.stream(url)


    proxySSE.emitter.on('message', (event) => {
      //=> Data messages (no event name, but defaults to 'message' in the browser).
      foliaInstance.stdout.push(event)

      res.sse.data(event.data);
      //=> Named event + data (data is mandatory)
      //=> Comment, not interpreted by EventSource on the browser - useful for debugging/self-documenting purposes.
      //=> In data() and event() you can also pass an ID - useful for replay with Last-Event-ID header.
    });

    // (not recommended) to force the end of the connection, you can still use res.end()
    // beware that the specification does not support server-side close, so this will result in an error in EventSource.
    // prefer sending a normal event that asks the client to call EventSource#close() itself to gracefully terminate.
    proxySSE.emitter.on('procterm', () => {
      populateFoliaResult(foliaInstance)
      res.end()

    })

    });
  });

}
