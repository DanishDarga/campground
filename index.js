const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const expressError = require("./utils/expressError");
const catchasync = require("./utils/catchasync");
const path = require("path");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const expressMongoSanitize = require("@exortek/express-mongo-sanitize");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");
const User = require("./models/user");

// if (process.env.NODE_ENV !== "production") {
require("dotenv").config();
// }
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const db_url = process.env.dburl;
console.log("DB URL:", db_url);

mongoose
  .connect(db_url)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(helmet({ contentSecurityPolicy: false }));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressMongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const storeVariable = MongoDBStore.create({
  mongoUrl: db_url,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "rew123",
  },
});

storeVariable.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store: storeVariable,
  secret: "rew123",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.all(/(.*)/, (req, res, next) => {
  next(new expressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(statusCode).render("campgrounds/error", { err });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
