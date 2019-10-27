const InternSignIn = require("../models/internsSignIn");
const InternSignOut = require("../models/internSignOut");
const Admin = require('../models/admin');
const Intern = require('../models/internsSignIn')
const User = require("../models/user");

module.exports = {
  index:async (req, res) => {
    await User.countDocuments((err, totalInterns)=>{
      res.render("admin/index", { layout: "admin",totalInterns:totalInterns });

    })
  },
  // =========================================== interns sign In GET =====================================
  internSignInGet: (req, res) => {
    InternSignIn.find().then(internsIn => {
      Admin.findOne({ firstName: "Bashir" }, (err, admin) => {
        const fullName = admin.firstName + " " + admin.lastName;
        res.render("admin/internSignin", { layout: "admin",internsIn:internsIn, admin:admin, fullName:fullName,});
      }).catch(e => console.log(e));
    });
  },
  // =========================================== interns sign Out GET =====================================
internSignOutGet: (req, res) => {
    InternSignOut.find().then(internsOut => {
        Admin.findOne({ firstName: 'Bashir' }, (err, admin) => {
            const fullName = admin.firstName + ' ' + admin.lastName
            pageTitle = 'Signed Out Interns'
            res.render('admin/internSignOut', { layout: 'admin', internsOut: internsOut, admin: admin, fullName: fullName, pageTitle })

            })
    }).catch((e) => console.log(e))

    },
    allInternGet: (req, res) => {
        User.find().then(user => {
            Admin.findOne({ firstName: 'Bashir' }, (err, admin) => {
                const fullName = admin.firstName + ' ' + admin.lastName
                pageTitle = 'All Interns'
                res.render('admin/allInterns', { layout: 'admin', admin: admin, user,fullName: fullName, pageTitle })

            })
        }).catch((e) => console.log(e))

    },
    logoutGet:(req, res)=>{
      req.logOut()
      req.flash('success', 'see you later')
      res.redirect('/')
    },
  searchPost: async (req, res) => {
    const id = req.body.id;
    console.log(id)
    let idIntegers = id.slice(3, 7)
    let idPrime = id.slice(0, 3)
    let idPrime2 = idPrime.toUpperCase()
    let searchId = `${idPrime2}${idIntegers}`
    console.log(searchId)
    console.log(idIntegers)
    console.log(idPrime2)
//     User.aggregate([
//       { $match: {} },
//       { $group: { _id: ''$internId", count: { $sum: 1 } } }
// ]);


    
    await User.findOne({ internId: searchId }, async (err, intern) => {
      // await Intern.aggregate([
      //   {$match:{}},
      //   {$group: {_id:"$internId", count:{$sum:1}}}
      // ])
        console.log(intern)
        if (!intern) {
          req.flash('error', 'No Intern with such Id!')
          return res.redirect('/admin')
        }
        console.log('CONSOLING FOUND INTERN:', intern)
        Admin.findOne({ firstName: 'Bashir' }, (err, admin) => {
          const internfullName = intern.firstName + ' ' + intern.lastName
          const fullName = admin.firstName + ' ' + admin.lastName
          pageTitle = 'Search Results'
          return res.render('admin/searchResult', { layout: 'admin',intern: intern,internfullName, pageTitle, admin: admin, fullName: fullName })
          if (err) { console.log(err) }
        })
      })

  },

};

