exports.isIntern = function (req, res, next) {
    if (req.isAuthenticated() && req.user.usertype === 'Intern') {
        return next()
    } else {
        req.flash('error', 'you have to login first')
        res.redirect('/')
    }
}



exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.usertype === 'Admin') {
        return next()
    } else {
        req.flash('error', 'you have to login first')
        res.redirect('/')
    }
}

exports.isUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('error', 'you have to login first')
        res.redirect('/')
    }
}