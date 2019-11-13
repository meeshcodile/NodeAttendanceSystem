const blogPost = require('../models/blogpost')
const user = require('../models/user')


module.exports = {
    index: (req, res)=>{
            res.render('default/index');
    },
    blog:async(req, res)=>{
            try{
               const pagination = req.query.pagination ? parseInt(req.body.pagination) :5;
               const page = req.query.page ? parseInt(req.query.page) :1;
                await blogPost.find({}, { '_id': 1, _id: 0 }).sort({'_id': -1}).skip((page - 1)* pagination).limit(pagination).then(blogpost => {
                res.render('default/blog', { blogpost: blogpost,pagination, page });
            })
            }
            catch(err){
                next(err)
            }
        // find({}, { "title": 1, _id: 0 }).sort({ "title": -1 })
        
    },
    
    loginGet:(req, res)=>{
        res.render('default/login')
    },
    loginPost:(req, res)=>{
        console.log(req.body)
    },
    dashboardGet: (req, res, next) => {
        if (req.user.usertype === 'Intern') {
            return res.redirect('/user/dashboard')
        } else if (req.user.usertype === 'Admin') {
            return res.redirect('/admin')
        } else {
            return req.flash('error', 'No User Found')
        }
    },
    logoutGet:(req, res)=>{
        req.logout()
        req.flash('success','see you later')
        res.redirect('/')
    }

    
}