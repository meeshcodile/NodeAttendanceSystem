const InternSignIn = require("../models/internsSignIn");
const InternSignOut = require("../models/internSignOut");
const Admin = require("../models/admin");
const User = require("../models/user");
const internExeat = require('../models/internRequest')
const mailer = require('../misc/mailer')
module.exports = {
  index: async (req, res) => {
    await User.countDocuments(async (err, totalInterns) => {
      await internExeat.countDocuments(async(err, totalExeatRequests)=>{
        await Admin.findOne({ firstName: "Bashir" }, (err, admin) => {
          const fullName = admin.firstName + " " + admin.lastName;
          res.render("admin/index", {
            layout: "admin",
            totalInterns: totalInterns,
            admin: admin,
            fullName: fullName,
            totalExeatRequests:totalExeatRequests
      })
     
        });
      });
    });
  },
  // =========================================== interns sign In GET =====================================
  internSignInGet: (req, res) => {
    InternSignIn.find().then(internsIn => {
      Admin.findOne({ firstName: "Bashir" }, (err, admin) => {
        const fullName = admin.firstName + " " + admin.lastName;
        res.render("admin/internSignin", {
          layout: "admin",
          internsIn: internsIn,
          admin: admin,
          fullName: fullName
        });
      }).catch(e => console.log(e));
    });
  },
  // =========================================== interns sign Out GET =====================================
  internSignOutGet: (req, res) => {
    InternSignOut.find()
      .then(internsOut => {
        Admin.findOne({ firstName: "Bashir" }, (err, admin) => {
          const fullName = admin.firstName + " " + admin.lastName;
          pageTitle = "Signed Out Interns";
          res.render("admin/internSignOut", {
            layout: "admin",
            internsOut: internsOut,
            admin: admin,
            fullName: fullName,
            pageTitle
          });
        });
      })
      .catch(e => console.log(e));
  },
  allInternGet: (req, res) => {
    User.find()
      .then(user => {
        Admin.findOne({ firstName: "Bashir" }, (err, admin) => {
          const fullName = admin.firstName + " " + admin.lastName;
          pageTitle = "All Interns";
          res.render("admin/allInterns", {
            layout: "admin",
            admin: admin,
            user,
            fullName: fullName,
            pageTitle
          });
        });
      })
      .catch(e => console.log(e));
  },
  logoutGet: (req, res) => {
    req.logOut();
    req.flash("success", "see you later");
    res.redirect("/");
  },

  searchPost: async (req, res) => {
    const { id } = req.body;
    console.log(id);
    const idIntegers = id.slice(3, 7);
    const idPrime = id.slice(0, 3);
    const idPrime2 = idPrime.toUpperCase();
    const searchId = `${idPrime2}${idIntegers}`;
    console.log(searchId);

    const [intern, signInsCount] = await Promise.all([
      User.findOne({ internId: searchId }),
      InternSignIn.countDocuments({ internId: searchId })
    ]);

    if (!intern) {
      req.flash("error", "No Intern with such Id!");
      return res.redirect("/admin");
    }
    const admin = await Admin.findOne({ firstName: "Bashir" });

    const internfullName = `${intern.firstName} ${intern.lastName}`;
    const fullName = `${admin.firstName} ${admin.lastName}`;
    const pageTitle = "Search Results";
    console.log(signInsCount);

    return res.render("admin/searchResult", {
      layout: "admin",
      signInsCount,
      intern,
      internfullName,
      pageTitle,
      admin,
      fullName
    });
  },

  allExeatGet:(req,res)=>{
    internExeat.find().then(exeat=>{
      res.render('admin/internExeat', { layout: 'admin', exeat })
    })
  },
  approveinternExeatGet: async (req, res) => {
    await internExeat.findById(req.params.id)
      .then(exeatRequest => {
        console.log('consoling found Application', exeatRequest)
        if (exeatRequest.isApproved == true) {
          req.flash('error', 'exeat application already approved')
          res.redirect('back')
        }

        //==========sending the confirmation email to the patient================
        const html = `Hello <strong> ${exeatRequest.fullName}</strong>,
                Your Exeat Request from <strong>${exeatRequest.fromDate} </strong>  to 
                <strong>${exeatRequest.toDate} </strong> have been approved please ensure to make yourself 
                available at the hub after the proposed date
                <br>
                <br>
        
                <strong>Thanks and Best Regards</strong>
      `
        // Sending the mail
        mailer.sendEmail('uschedule.info@gmail.com', exeatRequest.email, 'Exeat Approved', html);

        exeatRequest.isApproved = true;
        exeatRequest.save().then(exeatRequest => {
          req.flash('success', 'Exeat Application Approved')
          res.redirect('back')
        }).catch(err => {
          console.log(err)
        })

      }).catch(err => {
        console.log(err)
        req.flash('error', 'Approving unsuccessfull')
        res.redirect('back')
      })
  },
  declineinternExeatGet: async (req, res) => {
    await internExeat.findById(req.params.id)
      .then(exeatRequest => {
        console.log('consoling found Application', exeatRequest)
        if (exeatRequest.isApproved == true) {
          req.flash('error', 'application already approved')
          res.redirect('back')
        }

        //==========sending the confirmation email to the patient================
        const html = `Hello <strong> ${exeatRequest.fullName}</strong>,
                Due to your stated reason on your exeat application from<strong>${exeatRequest.fromDate} </strong> to
                <strong>${exeatRequest.toDate}</strong> has been denied please ensure to remain at the hub
                <br>
                <br>
                <strong>Thanks and Best Regards</strong>
      `
        // Sending the mail
        mailer.sendEmail('uschedule.info@gmail.com', exeatRequest.email, 'Exeat Declined', html);

        exeatRequest.isApproved = true;
        exeatRequest.save().then(exeatRequest => {
          req.flash('success', 'Exeat Application Declined')
          res.redirect('back')
        }).catch(err => {
          console.log(err)
        })

      }).catch(err => {
        console.log(err)
        req.flash('error', 'Declining unsuccessfull')
        res.redirect('back')
      })
  },
  deleteinternExeat: (req, res) => {
    internExeat.findByIdAndDelete(req.params.id)
      .then(deletedintern => {
        req.flash('success', 'Intern Exeat Request Successfully Deleted ')
        res.redirect('/admin/allExeat')
        return
      })
      .catch(err => {
        console.log(err)
      })
  },
};

