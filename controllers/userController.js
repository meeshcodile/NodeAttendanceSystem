const User = require('../models/user')
const randomstring = require('randomstring')
const mailer = require('../misc/mailer')
const projectTopics = require('../models/topic')
const InternSignIn = require('../models/internsSignIn')
const InternSignOut = require('../models/internSignOut')
const internExeat = require('../models/internRequest')
const blogPost = require('../models/blogpost')


module.exports = {
    registerGet: (req, res) => {
        res.render('default/register')
    },

    //===========================register post=============================
    registerPost:async(req, res,next)=>{
        try{
            
                // console.log(req.body)
                let { firstName, lastName, email, phoneNumber, institution, password,startingDate, endingDate, confirmPassword,department, usertype } = req.body
                let user = new User({ firstName, lastName, email, phoneNumber, institution, password, startingDate,department, endingDate, confirmPassword, usertype })
                console.log(user)

            

            const userEmail = await User.findOne({'email':req.body.email})
            if(userEmail){
                req.flash('error', 'email already exist')
                res.redirect('back')
                return
            }

            if(req.body.password !== req.body.confirmPassword){
                req.flash('error', 'password mismatch')
                res.redirect('back')
                return
            }

            const internId = `INT${randomstring.generate({length:4, charset:'numeric'})}`


            // Hash the password
            const hash = await User.hashPassword(req.body.password);
            req.body.password = hash;
            delete req.body.confirmPassword;

            const html = ` your intern identity number is <strong>${internId}</strong> you however are encouraged to keep it with you
            at all times has it will be your identity in the hub
            <br>
            <br>
            
            <strong> thanks and best regards<br>
            nhub foundation</strong>`

            await mailer.sendEmail('uschedule.info@gmail.com', req.body.email,'intern ID', html)



            // Saving store to database
            const newUser = await new User({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                institution: req.body.institution,
                password: req.body.password,
                usertype: 'Intern',
                internId:internId,
                startingDate:req.body.startingDate,
                endingDate:req.body.endingDate,
                department:req.body.department
            });
            await newUser.save();
            console.log(`${newUser} created successfully.`);

            req.flash('success', 'Intern successfully registered please you may login check your mail for your ID')
            res.redirect('/login')

        }
        catch(error){
            next (error)
        }
    },

    // ===================dashboard get============================
    dashboardGet:async(req, res)=>{
        let user = req.user; 
        projectTopics.find().then(topic=>{
            let fullName = user.firstName + ' ' + user.lastName
            console.log(fullName)
                res.render('default/profile', { layout: 'intern', user, topic: topic, fullName:fullName})            

        })
    },
    // ========================================  attendance SIgnIn Post ======================================
    signInPost: (req, res) => {
        // const id = req.params.id
        User.findById(req.params.id).then(user => {
            console.log('CONC:', user)
            if (user.isSignedIn === true) {
                req.flash('error', 'You have signed in already')
                res.redirect('back')
                return
            }
            let newSignIn = new InternSignIn({
                fullName: user.firstName + ' ' + user.lastName,
                internId: user.internId,
            })
            user.isSignedIn = true;

            newSignIn.save().then(newSignIn => {
                req.flash('success', `${newSignIn.fullName}, Thank You For Signing In Today`)
                return res.redirect('back')
            }).catch((err) => {
                console.log(err)
                req.flash('error', 'Something Went Wrong, Please Try Again')
                return res.redirect('back')
            })
        })
    },
    // =======================================  attendance SIgn Out Post =======================================
    signOutPost: (req, res) => {
        User.findById(req.params.id).then(intern => {
            let newSignOut = new InternSignOut({
                fullName: intern.firstName + ' ' + intern.lastName,
                internId: intern.internId,
            })
            newSignOut.save().then(newSignOut => {
                req.flash('success', `${newSignOut.fullName}, Thank You For Signing Out Today`)
                return res.redirect('back')
            }).catch((err) => {
                console.log(err)
                req.flash('error', 'Something Went Wrong, Please Try Again')
                return res.redirect('back')
            })
        })
    },
    // =====================logout get=============================
    logoutGet: (req, res) => {
        req.logout()
        req.flash('success', 'see you later')
        res.redirect('/')
    },

    // ============intern exeatpost ====================
    internExeatPost:(req, res)=>{
        const id = req.params.id
        console.log(id)
        User.findById(id).then(intern => {
            let newExeat = new internExeat ({
                message: req.body.message,
                fromDate: req.body.fromDate,
                toDate:req.body.toDate,
                fullName: intern.firstName + ' ' + intern.lastName,
                email: intern.email,
                internId: intern.internId
            })
            newExeat.save().then(newExeat => {
                console.log('Appointment savedd successfully', newExeat)
                req.flash('success', 'Your Exeat has been placed please await further instructions')
                res.redirect('back')
            }).catch(err => {
                console.log(err)
                req.flash('error', 'Something Went Wrong Please Try Again')
                return res.redirect('back')
            })
        })
    },
    // ==================adding topic to database post============================
    
    addTopicPost:async(req, res, next)=>{
        const id = req.params.id
        const newTopic = new projectTopics(req.body)
        console.log('newTopic', newTopic)
        const user =await User.findById(id).populate('topics')
        // console.log(topic)
        newTopic.projectTopic= user
        await newTopic.save()
        user.topics.push(newTopic)
        await user.save()
        console.log(newTopic)
    },


    // ===================blogPost route=========================
    blogPost:async(req, res)=>{
        const id = req.params.id
        await User.findById(id).then((blogpost)=>{
            let post = new blogPost({
                blogPost:req.body.blogPost,
                CreationDate:Date.now(),
                fullName:blogpost.firstName +' '+ blogpost.lastName
            })
    
            post.save().then((blogpost)=>{
                console.log(blogpost)
                req.flash('success', 'post successfully created')
                res.redirect('/user/dashboard')
            })
        })
    }


}


