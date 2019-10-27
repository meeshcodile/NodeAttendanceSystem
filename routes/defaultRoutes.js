const express = require("express");
const defaultController = require('../controllers/defaultController');
const passport = require('passport')
const auth = require('../config/customFunctions')
const isUser =auth.isUser
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Admin = require('../models/admin')
const LocalStrategy = require('passport-local').Strategy
const router = express.Router();


router.route("/")
  .get(defaultController.index);

router.route('/login')
  .get(defaultController.loginGet)
  

//======================defining the strategy to be used by the user==================
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField:'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  console.log(req.body)
  User.findOne({ email: email }).then(user => {
    if (!user) {
      
          Admin.findOne({ email: email }).then(user => {

            if (!user) {
              return done(null, false, req.flash('error', 'user not found'));
            }

            bcrypt.compare(password, user.password, (err, passwordMatched) => {
              if (err) {
                return err;
              }

              if (!passwordMatched) {
                return done(null, false, req.flash('error', 'Invalid Password, Please try again'));
              }

              return done(null, user, req.flash('success', 'Login Successful'));
            });

          })

        }
    bcrypt.compare(password, user.password, (err, passwordMatched) => {
      if (err) {
        return err;
      }

      if (!passwordMatched) {
        return done(null, false, req.flash('error', 'Invalid Password, Please try again'));
      }

      return done(null, user, req.flash('success', 'Login Successful'));
    });
  });
}));



//determines which data of the user object should be stored in the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (!user) {
          Admin.findById(id, function (err, user) {
            done(err, user);
          })
        } else {
          done(err, user);
        }
      });

});




router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
    session: true
  }), defaultController.loginPost);



router.route('/dashboard')
  .get(isUser,defaultController.dashboardGet)

router.route('/logout')
  .get(defaultController.logoutGet)

module.exports = router;