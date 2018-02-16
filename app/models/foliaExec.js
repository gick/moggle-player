var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var foliaExecSchema = mongoose.Schema({
    stdout:Array,
    label: String,
    owner: String,
    status: String,
    coloriage: String,
    coloriageFilename:String,
    coloriageContentType:String,
    coloriageLength:Number,
    leaf: String,
    leafFilename:String,
    leafContentType:String,
    leafLength:Number,
},{ usePushEach: true })

module.exports = mongoose.model('FoliaExec', foliaExecSchema);
