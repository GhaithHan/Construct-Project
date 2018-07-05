const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/user-model.js");
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/settings", (req, res, next) => {
  if(!req.user) {

    //redirect away if you arent logged in
    // req.flash("error", "you must logged in.")
    res.redirect("/login");
    return;
  }
  res.render("settings-page.hbs")
});

router.post("/process-settings", (req, res, next) => {
  if(!req.user) {
    // req.flash("error", "You must be logged in");
    res.redirect("login");
    return;
  }

  const { firstName, lastName, oldPassword, newPassword } = req.body;
   let changes = { firstName, lastName };
  if(oldPassword && newPassword) {
    if (!bcrypt.compareSync(oldPassword, req.user.encryptedPassword)) {
      // req.flash("error", "Old password incorrect.");
      res.redirect("/settings");
      return;
    }

    const encryptedPassword = bcrypt.hashSync(newPassword, 10);
    changes = { firstName, lastName, encryptedPassword };
  }
  

  User.findByIdAndUpdate(
    req.user._id,
    {$set: changes},
    {runValidators: true}
  )
  .then((userDoc) => {
    // req.flash("success", "Settings saved succefully");
    res.redirect("/profile");
  })
  .catch((err) => {
  next(err);
  })

})

module.exports = router;
