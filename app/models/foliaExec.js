var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var foliaExecSchema = mongoose.Schema({
    stdout:Array,
    playerID:String,
    resultCSV:Array,
    maskFileBase64:String,
    label: String,
    owner: String,
    status: String,
    coloriageFileBase64: String,
    colorFilename:String,
    leafId: String,
    leafFilename:String,
    leafContentType:String,
    leafLength:Number,
})

module.exports = mongoose.model('FoliaExec', foliaExecSchema);
