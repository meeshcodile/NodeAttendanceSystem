module.exports = {
    index: (req, res)=>{
        res.render('default/index');
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