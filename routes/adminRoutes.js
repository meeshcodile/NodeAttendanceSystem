const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require('../config/customFunctions')
const isAdmin = auth.isAdmin
const multer = require('multer')
const cloudinary = require('cloudinary')
const path= require('path')
const Admin = require('../models/admin')



// ====================configuring multer======================
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "-" + Date.now());
    }
});
var upload = multer({
    storage: storage,
    //  limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

//=====================Check File Type===========================
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        // req.flash('error','Invalid File')
        // return res.redirect('back')
        cb('ERROR: KINDLY UPLOAD A VALID APPLICAION LETTER FILE');
    }
}
// ===================================================   CLOUDINARY SETUP =====================================
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret:process.env.api_secret

})

// ===============admin index route============
router.route("/")
    .get(adminController.index);

//=======================all internsSign in routes===================
router.route('/internSignIn')
    .get(isAdmin,adminController.internSignInGet)

// ===================admin search route=============================
router.route('/search')
    .post(isAdmin,adminController.searchPost)

//=====================all  internssignOut route===============
router.route('/internSignOut')
    .get(isAdmin,adminController.internSignOutGet)

// ===========approving internExeat==============
router.route('/approveinternExeat/:id')
    .get(isAdmin, adminController.approveinternExeatGet)

//=====================declining internExeat
router.route('/declineinternExeat/:id')
    .get(isAdmin, adminController.declineinternExeatGet)

//==================deleting internExeat
router.route('/deleteinternExeat/:id')
    .delete(isAdmin, adminController.deleteinternExeat)

//===========all internExeat
router.route('/allExeat')
    .get(isAdmin,adminController.allExeatGet)

//==================all interns route
router.route('/allinterns')
    .get(isAdmin,adminController.allInternGet)
//=========admin logout route============
router.route('/logout')
    .get(isAdmin,adminController.logoutGet)

// ==================Adding the Topics=======================
// router.route('/addTopic/:id')
//     .post(isAdmin, adminController.addTopicPost)


//=======================image uplaod route===================
router.route('/uploadImage/:id')
    .post(isAdmin,upload.single('profilePic'), function (req, res, next) {
        if (req.file == undefined) {
            req.flash('error', 'No File Chosen')
            return res.redirect('back')

        }
        const id = req.params.id
        console.log(id)
        Admin.findById(id).then(user => {
            cloudinary.v2.uploader.upload(req.file.path, async (err, result) => {
                user.profilePicture = result.secure_url;
                await user.save().then(user => {
                    req.flash('success', `profile Picture for ${user.firstName} has been updated`)
                    return res.redirect('back')
                }).catch((err) => {
                    console.log(err)
                    req.flash('error', 'Something Went Wrong Please Try Again')
                    return res.redirect('back')
                })
                if (err) {
                    console.log(err)
                    req.flash('error', 'Something Went Wrong Please Try Again')
                    return res.redirect('back')
                }
            })
        })

    }
    )


module.exports = router;
