var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mcqSchema = mongoose.Schema({
    label: String,
    readonly: String,
    owner: String,
    status: String,
    question: String,
    distractors:Array,
    response: String,
    media: { type: Schema.Types.ObjectId, ref: 'StaticMedia',autopopulate:true },
    type: { type: String, default: 'mcq' },
    typeLabel: { type: String, default: 'Multiple choice question' },

    correctMessage: String,
    wrongMessage: String
})
mcqSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('MCQ', mcqSchema);