const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport'); 

const User = require("../models/user-model.js");

const router  = express.Router();

router.get("/signup", (req, res, next) => {
    res.render("auth-views/signup-form.hbs")
});

router.post("/process-signup", (req, res, next) => {
    const {firstName, lastName, job, email, originalPassword} = req.body;

    if(originalPassword === "" || originalPassword. match(/[0-9]/) === null) {
        // req.flash("error", "password can't be blank and requires a number (0-9).")
        res.redirect("/signup");
        return; 
     }
     const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
     User.create({ firstName, lastName, job, email, encryptedPassword })
      .then((userDoc) => {

        // req.flash("success", "signed up successfuly try logging in.")
        res.redirect("/");
      })
      .catch((err) => {
          next(err);
      });
});

router.get("/login", (req, res, next) => {
    res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
    const { email, loginPassword } = req.body;

    //check the email by searching the database
    User.findOne({email})
     .then((userDoc) => {
         //userDoc will be falsy if we didnt find a user (wrong email)
         if(!userDoc) {
         res.redirect("/login");
         return;
         }

         // we are ready to check the password if we get here (email was okay)
         const { encryptedPassword } = userDoc;
         if(!bcrypt.compareSync(loginPassword, encryptedPassword)) {
             res.redirect("/login");  
            
             return;
         }
         // we are ready to LOG IN if we get here (password was okay too)
         // "req.login()" is a passport method for logging in a user
         // (behind the scenes it calls our "passport.serialize()" function)
         req.login(userDoc, () => {
             console.log("You are logged in!");
             
         res.redirect("/profile");
         //  renvoyer apres le user a notre platform
         });
     })
     .catch((err) => {
         next(err);
     })
});

router.get("/logout", (req, res, next) => {
    req.session.projectId = null;
    req.logout();

    // req.flash("success", "logged out successfuly");
    res.redirect("/");
});

router.get("/profile", (req, res, next) => {
    res.render("auth-views/user-profile.hbs")
})

module.exports = router;

