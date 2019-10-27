const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require('../config/customFunctions')
const isAdmin = auth.isAdmin

router.route("/")
    .get(adminController.index);

router.route('/internSignIn')
    .get(isAdmin,adminController.internSignInGet)

router.route('/search')
    .post(isAdmin,adminController.searchPost)

router.route('/internSignOut')
    .get(isAdmin,adminController.internSignOutGet)

router.route('/allinterns')
    .get(isAdmin,adminController.allInternGet)

router.route('/logout')
    .get(isAdmin,adminController.logoutGet)


    
module.exports = router;
