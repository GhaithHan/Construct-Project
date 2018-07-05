const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskTitle : { type: String, required: true},
    taskDescription : { type: String },
    taskAssignedTo: String,
    taskAssignedId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
        },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    taskStartDate : { type : Date, required : true},
    taskDeadline : { type : Date, required : true},
   }, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;