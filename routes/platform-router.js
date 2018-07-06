const express = require("express");

const nodemailer = require("nodemailer");

const Project = require("../models/project-model.js");
const User = require("../models/user-model.js");
const Task = require("../models/task-model.js");
const Note = require("../models/note-model.js");
const File = require("../models/file-model.js");

const router = express.Router();

// ------------------------------------------ upload files

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require ("multer-storage-cloudinary");cloudinary.config({
   cloud_name: process.env.cloudinary_name,
   api_key:process.env.cloudinary_key,
   api_secret:process.env.cloudinary_secret,
});
const storage =
 cloudinaryStorage({
   cloudinary,
//    resource_type: 'raw',
//    type: 'raw',
   folder: "project-files",
   params:{
       resource_type:"raw"
   },
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

// router.post("/process-upload", uploader.single("fileUpload"), (req, res, next) => {
//     res.locals.layout = "layout-project.hbs";
//     if(!req.user) {
//         res.redirect("/login");
//         return;
//       }

//     const { projectId, fileUrl } = req.body;
//     const { secure_url } = req.file;

//     File.create({
//         fileUrl : secure_url,
//     })
//     .then((fileDoc) => {
//         res.redirect(`/project/${projectId}/file`)
//     })
//     .catch((err) => {
//         next(err);
//     });
// });

// router.get("/project/:projectId/file", (req, res, next) => {
//     res.locals.layout = "layout-project.hbs";
//     if(!req.user) {
//         res.redirect("/login");
//         return;
//       }
//     const{ projectId } =req.params;
//     console.log("---------------------------ProjectId inside files");
//     console.log(projectId);
//     File.find()
//     .then((fileResults) => {
//         res.locals.fileArray = fileResults;
//         res.render("platformProject/filePage.hbs")
//     })
//     .catch((err) => {
//         next(err);
//     });
// });















router.post("/process-teamAdd", (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }

 const { userId, projectId } = req.body;
//  console.log( "USER ID -------------------");
//  console.log(userId);
//  console.log( "PROJECT ID -------------------");
//  console.log(projectId);
 Project.findByIdAndUpdate(
    { _id: projectId },
    { $addToSet : { team : { _id: userId } } }
)
.then(()=>{
    User.findById(userId)
    .then((userDoc) => {
        transport.sendMail({
            from : 'The Construct Team <exposure@example.com>',
            to : userDoc.email,
            subject : "Thank you for joigning our Wonderful Team 🐫 !" ,
            text : `Welcome ${userDoc.firstName} ${userDoc.lastName} ! You are ONE OF USE NOW 🐈 !`,
            html : `
            <h1 style="color:orange;">Welcome ${userDoc.firstName}!</h1>
            <p>You are ONE OF US NOW 🤗 !</p>
            <p>We are looking forward to colaborate with you in this project !</p>
            <p>Be an active player 👽 in this process :</p>
            <ul>
            <li>Check the project progress 🍺!</li>
            <li>Be aware of the tasks that have been assigned to you 📞!</li>
            <li>Add new notes 🎫!</li>
            <li>Upload the necessary files ⛔!</li>
            </ul>
            <p>Don't worry ! The payment will be honored (or not...😂)</p>
            `,
        })
        .then(() => {
            res.redirect(`/project/${projectId}/team`);
        })
  });
})
  .catch((err) => {
      next(err);
  });
});

router.get("/project/:projectId/team", (req, res, next) => {

    if(!req.user) {
        res.redirect("/login");
        return;
      }

      const { projectId } = req.params;
    //   console.log( "PROJECT ID -------------------");
    //   console.log(projectId)
    User.find()
    .then((userResults) =>{
        res.locals.layout = "layout-project.hbs";
        res.locals.userListArray = userResults;
        Project.findById(projectId)
        .populate( "team" )
        .then((actualProject) => {
            res.locals.memberTeamAdded = actualProject.team;
            res.render("platformProject/teamPage.hbs")
        })

    })
    .catch((err) => {
        next(err);
    });

});


// router.post("/process-note", (req, res, next) => {
//     res.locals.layout = "layout-project.hbs";
//     if(!req.user) {
//         res.redirect("/login");
//         return;
//       }

//       const { projectId, noteCreater, noteContent } = req.body;
//       Note.create({ noteCreater, noteContent } )
//       .then((noteDoc) => {
//         //   res.locals.newTask = taskDoc;
//           res.redirect(`/project/${projectId}/note`);
//       })
//       .catch((err) => {
//           next(err);
//       });
// });

// router.get("/project/:projectId/note", (req, res, next) => {
//     // res.send(req.body);
//     // return;
//     res.locals.layout = "layout-project.hbs";
//     if(!req.user) {
//         res.redirect("/login");
//         return;
//       }
//       const { projectId } = req.params;

//       Note.find()
//       .then((noteResult) => {
//         res.locals.noteArray = noteResult;
//           res.render("platformProject/notePage.hbs")
//       })
//       .catch((err) => {
//           next(err);
//       });
// });


// Route fot FILES ----------------------------------------------------------
// --------------------------------------------------------------------------






//     File.create({
//         fileUrl : secure_url,
//     })
//     .then((fileDoc) => {
//         res.redirect(`/project/${projectId}/file`)
//     })
//     .catch((err) => {
//         next(err);
//     });
// });

router.post("/process-upload", uploader.single("fileUpload"), (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }
      const { projectId, fileUrl } = req.body;
      const { secure_url } = req.file;
      File.create({
          fileUrl : secure_url,
      })
      .then((fileDoc) => {
        Project.findByIdAndUpdate(

            { _id: projectId },
            { $addToSet : { files : { _id: fileDoc._id } } }
        )
        .then(()=>{
            res.redirect(`project/${projectId}/file`);
        })
    })
    .catch((err) => {
        next(err);
    });
});


router.get("/project/:projectId/file", (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }
      const { projectId } = req.params;
      Project.findById(projectId)
      .populate("files")
      .then((projectResult) => {
        res.locals.filesArray = projectResult.files;
        res.render("platformProject/filePage.hbs")

    })
    .catch((err) => {
          next(err);
      });
});





// Route fot NOTES ----------------------------------------------------------
// --------------------------------------------------------------------------

router.post("/process-note", (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }
      const {  projectId, noteCreater, noteContent } = req.body;
      Note.create({   noteCreater, noteContent } )
      .then((noteDoc) => {
        console.log("----------------------------noteDoc");
        console.log(noteDoc);
        console.log(noteDoc._id);
        Project.findByIdAndUpdate(

            { _id: projectId },
            { $addToSet : { notes : { _id: noteDoc._id } } }
        )
        .then(()=>{
            res.redirect(`project/${projectId}/note`);
        })
    })
    .catch((err) => {
        next(err);
    });
});


router.get("/project/:projectId/note", (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }
      const { projectId } = req.params;
      Project.findById(projectId)
      .populate("notes")
      .then((projectResult) => {
          console.log("----------------------------Actual Project ");
          console.log(projectResult);
        res.locals.notesArray = projectResult.notes;
        res.render("platformProject/notePage.hbs")
        // console.log("----------------------------Actual note ");
        //   console.log(notesArray);
    })
    .catch((err) => {
          next(err);
      });
});













router.post("/process-task", (req, res, next) => {
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }
      const { taskAssignedId, projectId, taskTitle, taskDescription, taskAssignedTo, taskStartDate, taskDeadline } = req.body;
      Task.create({ owner: req.user._id, taskAssignedId, taskTitle, taskDescription, taskAssignedTo, taskStartDate, taskDeadline } )
      .then((taskDoc) => {
        Project.findByIdAndUpdate(
            { _id: projectId },
            { $addToSet : { tasks : { _id: taskDoc._id } } }
        )
            .then(()=>{
                res.redirect(`project/${projectId}/task`);
            })
      })
      .catch((err) => {
          next(err);
      });
});

router.get("/project/:projectId/task", (req, res, next) => {
    // res.send(req.body);
    // return;
    res.locals.layout = "layout-project.hbs";
    if(!req.user) {
        res.redirect("/login");
        return;
      }
      const { projectId } = req.params;
      Project.findById(projectId)
      .populate("team")
      .populate("tasks")
      .then((projectResult) => {
        res.locals.tasksArray = projectResult.tasks;
        res.locals.actualProjectTeam = projectResult.team;
        console.log("----------------------------Actual Project Team");
        console.log(projectResult);


        res.render("platformProject/taskPage.hbs")
      })
      .catch((err) => {
          next(err);
      });
});





module.exports = router;