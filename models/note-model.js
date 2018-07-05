// don't forget something

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({

    // noteCreater: {type: String, required: true},
    noteCreater: {type: String},
    noteContent: {type: String, required: true}

   }, {

    timestamps: true
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;