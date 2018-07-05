const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({

    fileUrl: {type: String, required: true}
    
   }, {

    timestamps: true
});

const File = mongoose.model("File", fileSchema);

module.exports = File;