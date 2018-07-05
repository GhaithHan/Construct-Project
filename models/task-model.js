const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskTitle : { type: String, required: true},
    taskDescription : { type: String },
    //  Review after creating teams in the platform
    // taskAssignedTo : {
    //     type : Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    //     },
    taskAssignedTo : {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
        },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    // taskProject :{
    //     type : Schema.Types.ObjectId,
    //     ref: "Project",
    //     required: true
    // },
    taskStartDate : { type : Date, required : true},
    taskDeadline : { type : Date, required : true},
   }, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;