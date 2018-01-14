module.exports = function(app, gfs) {
    var zbarimg = require('zbarimg')

    var fs = require('fs');

    app.get('/listAllFiles', function(req, res) {
        gfs.files.find({}).toArray(function(err, files) {
            res.send(files);
        })
    });
    // handle media posted by authenticated users
    /*
    app.post('/qrscan', function(req, res) {
        var path = 'filetest.png',
            buffer = req.files.file.data;

        fs.open(path, 'w', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }

            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {

                    zbarimg('filetest.png',function(error,qrcode){
                        console.log(error)
                        res.send(qrcode)
                    });
                })
            });
        });

    })
*/

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