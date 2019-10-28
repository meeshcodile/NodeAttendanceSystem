require("dotenv").config("./.env");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expresshandlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
const mongoStore = require("connect-mongo")(session);


const port = process.env.PORT || 5000;


// Database connections
mongoose.Promise = global.Promise;
const MONGO_URL = require("./config/db").MONGOURL;

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(`Database Connection failed ${err.message}`));

app.use(logger("dev"));

//setting the templating engine
app.engine(".hbs",expresshandlebars({
    defaultLayout: "default",
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

// ===================method override middleware==================
app.use(methodOverride("newMethod"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "zacks",
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 180 * 60 * 1000
    }
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Setup flash/ Environmental variables
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success");
  res.locals.error_messages = req.flash("error");
  res.locals.user = req.user ? true : false;
  res.locals.session = req.session;
  next();
});



// Route grouping
const defaultRoutes = require("./routes/defaultRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require('./routes/userRoutes')
app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);
app.use('/user', userRoutes)

app.listen(port, (req, res) => {
  console.log(`server started on port ${port}`);
});
