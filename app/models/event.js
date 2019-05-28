var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = mongoose.Schema({
    Date:Date,
    eventType: String,
    eventObject: Object,
    activityName: String,
    activityId:String,
    ugName:String,
    ugId:String,
    user:String,
    sessionUID:String
})

module.exports = mongoose.model('Event', eventSchema);