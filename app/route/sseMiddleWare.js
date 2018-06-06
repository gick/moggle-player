module.exports = function(app) {
  var ObjectId = require('mongoose').Types.ObjectId;
  var fs = require('fs')
  var request = require('request')

  var FoliaExec = require('../models/foliaExec.js')


  app.get('/execFolia/:id',function(req, res) {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'No folia Id provided'
      })
    }
    FoliaExec.findById(req.params.id)
      .exec(function(err, foliaInstance) {
        var url = 'http://localhost:8081/setupImages/'+ foliaInstance._id
        request.get(url)
      })
      .then(()=>res.send({status:'ok'}),res.send({status:'ko'}))

       
  }



)}
