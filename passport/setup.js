const passport      = require("passport");
const User          = require("../models/user-model.js");

passport.serializeUser((userDoc, done)=>{
    console.log("SERIALIZE (save to session)");
    done (null,userDoc._id)
});

passport.deserializeUser((idFromSession, done)=>{
    console.log("DESERIALIZE (user data from the database)");
    User.findById(idFromSession)
    .then((userDoc)=>{
        done(null,userDoc);
    })
    .catch((err)=>{
        next(err);
    })
})

// app.js will call this function
function passportSetup (app) {
    // add Passport properties & methods to the "req" object in our routes
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.blahUser = req.user;
    res.locals.projectId = req.session.projectId;
    console.log(req.session);

    next();
  });
}

module.exports = passportSetup;