const express = require("express");
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../config/customFunctions')
const randomstring =require('randomstring')
const isIntern = auth.isIntern
const User = require('../models/user')
const multer = require('multer')
const mailer = require('../misc/mailer')
const cloudinary = require('cloudinary')
const path = require('path')
// const auth = require('../config/customFunctions')
// const isIntern = auth.isIntern



// ==================configuring multer=============
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

// ======================Check File Type
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
    api_secret: process.env.api_secret

})

// ================dashboard get route=======================
router.route('/dashboard')
    .get(isIntern,userController.dashboardGet)
// ==================sign in routeeeeee====================
router.route('/signIn/:id')
    .post(isIntern,userController.signInPost)
// ========================signout route===================
router.route('/signOut/:id')
    .post(isIntern, userController.signOutPost)


router.route('/blogPost/:id')
    .post(isIntern, userController.blogPost)
// ========================================register routr=====================
router.route('/register')
    .get(userController.registerGet)
    .post(userController.registerPost)

router.route('/logout')
    .get(userController.logoutGet)
// ===================intern exeatrout==================
router.route('/internExeat/:id')
    .post(isIntern,userController.internExeatPost)
// router.route('/addTopic')
//     .get(isIntern,userController.addTopicGet)

router.route('/addTopic/:id')
    // .get(isIntern,userController.addTopicGet)
    .post(isIntern,userController.addTopicPost)
// ================uploading profile picture route================
router.route('/uploadImage/:id')
    .post(isIntern,upload.single('profilePic'), function (req, res, next) {
            console.log(req.body)
            console.log(req.file)
            if (req.file == undefined) {
                req.flash('error', 'No File Chosen')
                return res.redirect('back')

            }
            User.findById(req.params.id).then(user => {
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