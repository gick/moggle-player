// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
/*
var mapinfoSchema = mongoose.Schema({
    marker:String,
    centerLatitude:Number,
    centerLongitude:Number,
    zoomLevel:Number,
})*/
var gameSchema = mongoose.Schema({

    label: String,
    feedbackMedia: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
    startMedia: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },

    POI: { type: Schema.Types.ObjectId, ref: 'POI' },
    poiMapGuidance:{type : Boolean,default:false},
    poiReachedMessage: String,

    readonly: String,
    owner: String,
    status: { type: String, default: 'Private' },
    
    identificationActivity:{type:Schema.Types.ObjectId,ref:'Folia'},
    freetextActivities: [{ type: Schema.Types.ObjectId, ref: 'FreeText' }],
    mcqActivities: [{ type: Schema.Types.ObjectId, ref: 'MCQ' }],

    inventoryItem: { type: Schema.Types.ObjectId, ref: 'InventoryItem' },

    typeLabel: { type: String, default: 'Unit game' },
    type: { type: String, default: 'unitgame' },

});

// generating a hash

module.exports = mongoose.model('Game', gameSchema);