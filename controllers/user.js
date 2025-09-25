const User = require("../models/user");

module.exports.renderRegister = async (req, res) => {
  res.render("user/register");
};

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log("Registered User Successfully");
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully registered");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}`); // safer: use req.user instead of req.body
  let redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo;

  // If the user was trying to create, update, or delete a review, the returnTo URL will be
  // something like /campgrounds/:id/reviews/... which doesn't have a GET route.
  // We'll intercept this and redirect them to the campground's show page instead.
  if (redirectUrl.includes("/reviews")) {
    const campgroundId = redirectUrl.split("/")[2];
    redirectUrl = `/campgrounds/${campgroundId}`;
  }
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/home");
  });
};
