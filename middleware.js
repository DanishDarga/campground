const campground = require("./models/campground");
const { campgroundSchema, reviewSchema } = require("./schemas");
const expressError = require("./utils/expressError");
const reviews = require("./models/review");

const isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (!req.files || req.files.length === 0) {
    throw new expressError("At least one image is required", 400);
  }

  req.files.forEach((file) => {
    if (!file.mimetype.startsWith("image/")) {
      throw new expressError("Only image files are allowed", 400);
    }
  });
  if (error) {
    console.log("🚨 Joi validation failed:", error.details);
    const msg = error.details.map((el) => el.message).join(", ");
    throw new expressError(msg, 400);
  } else {
    console.log("✅ Joi validation passed");
    next();
  }
};
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const Campground = await campground.findById(id);
  if (!Campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await reviews.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

module.exports = {
  isLoggedin,
  storeReturnTo,
  validateCampground,
  isAuthor,
  validateReview,
  isReviewAuthor,
};
