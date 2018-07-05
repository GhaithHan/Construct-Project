const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName : { type: String, required: true, unique: true},
    projectDescription : { type: String },
    clientName : { type: String, required: true},
    startOfProject : { type: Date, required: true},
    endOfProject : { type: Date, required: true},
    adress : { type: String, required: true},
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: "Task",
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note",
    }],
    files: [{
        type: Schema.Types.ObjectId,
        ref: "File",
    }],
    team : [
        {
        type: Schema.Types.ObjectId,
        ref: "User",
        }
    ],
    // team : { type : Array},
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
   }, {
    timestamps: true
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;