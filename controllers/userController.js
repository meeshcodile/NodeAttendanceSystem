const User = require('../models/user')
const randomstring = require('randomstring')
const mailer = require('../misc/mailer')
const projectTopics = require('../models/topic')
const InternSignIn = require('../models/internsSignIn')
const InternSignOut = require('../models/internSignOut')



module.exports = {
    registerGet: (req, res) => {
        res.render('default/register')
    },
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
    dashboardGet:(req, res)=>{
        let user = req.user;
            res.render('default/profile', { layout: 'intern', user})
    },
    // ========================================  attendance SIgnIn Post ======================================
    signInPost: (req, res) => {
        // const id = req.params.id
        User.findById(req.params.id).then(user => {
            console.log('CONC:', user)
            if (user.isSignedIn === true) {
                req.flash('error', 'You have signed in already')
                res.redirect('back')
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
    // https://res.cloudinary.com/dzl4he0xn/image/upload/v1571834880/sample.jpg
    // topicUploadPost:async(req, res)=>{
    //     const id =req.params.id
    //     console.log(id)
    //     await User.findById(id).then(async(topic) =>{
    //         // const topics = req.body.projectTopic
    //         // console.log(topics)
    //         await topic.save({projectTopic:req.body.projectTopic}).then(topic=>{
    //              console.log('topic saved')
    //              req.flash('success', 'topic added successfully')
    //              console.log(topic)
    //              res.redirect('back')
    //         }).catch(err=>{
    //             console.log(err)
    //             req.flash('error','something went wrong')
    //             res.redirect('back')
    //         })
    //     })
    // },
    topicUploadPost: async (req, res) => {
        const id = req.params.id
        console.log(id)
        const projectTopic = req.body.projectTopic
        var myquery = { projectTopic: 'fuck you'};
        var newvalues = {projectTopic: projectTopic};
        await User.findById(id).then(async (topic) => {
            await User.updateOne(myquery, newvalues).then((user)=>{
                req.flash('success','topic added successfully')
                res.redirect('back')
                console.log('update')
            }).catch((err)=>{
                req.flash('errror','something went wrong')
                res.redirect('back')
                console.log(err)
            })
            
        }).catch((err)=>{
            req.flash('errror','something went wrong')
                res.redirect('back')
            console.log(err)
        })
    },
    logoutGet: (req, res) => {
        req.logout()
        req.flash('success', 'see you later')
        res.redirect('/')
    }


}