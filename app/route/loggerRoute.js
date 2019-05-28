module.exports = function(app) {
  var Event = require("../models/event");
  app.post("/api/eventLog", function(req, res) {
    let {
      eventType,
      eventObject,
      activityName,
      activityId,
      ugName,
      ugId,
      user,
      sessionUID
    } = req.body;
    event = new Event(
    );
    event.eventType=eventType
    event.eventObject=eventObject
    event.activityName=activityName
    event.activityId=activityId
    event.ugName=ugName
    event.ugId=ugId
    event.user=user
    event.Date=new Date()
    event.sessionUID=sessionUID
    event.save();
    res.send({ success: true });
  });
  app.get("/api/eventLog", function(req, res) {
    Event.find({}).exec(function(err, response) {
      res.send(response);
    });
  });
};
