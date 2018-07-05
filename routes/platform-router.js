const express = require("express");

const nodemailer = require("nodemailer");

const Project = require("../models/project-model.js");
const User = require("../models/user-model.js");
const Task = require("../models/task-model.js");
const Note = require("../models/note-model.js");

const router = express.Router();

// ------------------------------------------ upload files

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require ("-storage-cloudinary");cloudinary.config({
   cloud_name: process.env.cloudinary_name,
   api_key:process.env.cloudinary_key,
   api_secret:process.env.cloudinary_secret,
});
const storage =
 cloudinaryStorage({
   cloudinary,
   resource_type: 'raw',
   folder: "project-files"
 });
const uploader = multer({storage});

const transport =
nodemailer.createTransport({
   service:'Gmail',
   auth:{
       user : process.env.gmail_email,
       pass : process.env.gmail_password,
   }
});

router.post("process-upload", uploader.single("fileUpload"), (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }

})

router.post("/process-teamAdd", (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {

        //redirect away if you arent logged in
        // req.flash("error", "you must logged in.")
        res.redirect("/login");
        return;
      }

 const { userId, projectId } = req.body;
 console.log( "USER ID -------------------");
 console.log(userId);
 console.log( "PROJECT ID -------------------"); 
 console.log(projectId);
 Project.findByIdAndUpdate(
    { _id: projectId }, 
    { $addToSet : { team : { _id: userId } } }
)
.then(()=>{
    User.find({userId})
    .then((userDoc) => {
        transport.sendMail({
            from : 'Express Users <exposure@example.com>',
            to : `<${userDoc.email}>`,
            subject : "Thank you for joigning our service :camel: !" ,
            text : `Welcome ! You are ONE OF USE NOW 🐈 !`,
            html : `
            <h1 style="color:orange;">Welcome !</h1>
            <p>You are ONE OF USE NOW 🐈 !</p>
            `,
        })
    })
  .then(() => {
      res.redirect(`project/${projectId}/team`);
  });
})
  .catch((err) => {
      next(err);
  });
});

router.get("/project/:projectId/team", (req, res, next) => {

    if(!req.user) {
        //redirect away if you arent logged in
        // req.flash("error", "you must logged in.")
        res.redirect("/login");
        return;
      }

      const { projectId } = req.params;
      console.log( "PROJECT ID -------------------");
      console.log(projectId)
    User.find()
    .then((userResults) =>{
        res.locals.layout = "layout-project.hbs";
        res.locals.userListArray = userResults;
        Project.findById(projectId)
        .populate( "team" )
        .then((actualProject) => {
            res.locals.memberTeamAdded = actualProject.team;
            console.log( "team member-------------------");
            // console.log(memberTeamAdded);
            res.render("platformProject/teamPage.hbs")
        })
        
    })
    .catch((err) => {
        next(err);
    });

});



// router.post("/process-task", (req, res, next) => {
//     res.locals.layout = "layout-project.hbs";
//     if(!req.user) {
//         //redirect away if you arent logged in
//         // req.flash("error", "you must logged in.")
//         res.redirect("/login");
//         return;
//       }
    
//       const { projectId, taskTitle, taskDescription, taskAssignedTo, taskStartDate, taskDeadline } = req.body;
//       Task.create({ owner: req.user._id, taskTitle, taskDescription, taskAssignedTo, taskStartDate, taskDeadline } )
//       .then((taskDoc) => {
//         //   res.locals.newTask = taskDoc;
//           res.redirect(`project/${projectId}/task`);
//       })
//       .catch((err) => {
//           next(err);
//       });
// });

// router.get("/project/:projectId/task", (req, res, next) => {
//     // res.send(req.body);
//     // return;
//     res.locals.layout = "layout-project.hbs";
//     if(!req.user) {
//         //redirect away if you arent logged in
//         // req.flash("error", "you must logged in.")
//         res.redirect("/login");
//         return;
//       }
//       const { projectId } = req.params;

//       Project.find({projectId})
//       .then((projectResult) => {
//         console.log("-----------projectId")
//         console.log(projectId);
//         res.locals.actualProject = projectResult;
//         console.log("---------------actualProject");
//         console.log(actualProject);
//           Task.findById({owner : req.user._id})
//           .populate("taskAssignedTo")
//           .then(teamTask)
          
//           res.locals.taskTeamAdded = teamTask;
//           res.render("platformProject/taskPage.hbs")
//       })
//       .catch((err) => {
//           next(err);
//       });
// });






module.exports = router;