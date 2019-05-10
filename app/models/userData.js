var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);


var userDataSchema = mongoose.Schema({
            userId: String,
            score: [],
            badge: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    }, { usePushEach: true })

    userDataSchema.plugin(deepPopulate,{})

module.exports = mongoose.model('UserData', userDataSchema);
