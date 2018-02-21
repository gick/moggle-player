module.exports =  function(app){
  var EventSource=require('eventsource')
  var events = require('events');
  var sseEmitter = new events.EventEmitter();
  var FoliaExec = require('../models/foliaExec.js')


  var es = function(url){
      var source=new EventSource(url)
      source.on('error',function(){
        console.log('problem')
        source.close()
      })
      var startDate=Date.now()
      source.addEventListener('message', function (e){
        if(e.data.indexOf('EOF')>-1)
        {
          sseEmitter.emit('procterm',{data:"Analyse terminée",timestamp:Date.now()-startDate})
          source.close()
        }else{
        sseEmitter.emit('message',{data:e.data,timestamp:Date.now()-startDate})}
      })}

    return {stream:es,emitter:sseEmitter}
};
