const express = require("express");
const router = express.Router();
const catchasync = require("../utils/catchasync");
const { isLoggedin } = require("../middleware");
const { validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campground");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router.get("/", catchasync(campgrounds.index));

router.get("/new", isLoggedin, campgrounds.newForm);

router.get("/:id", catchasync(campgrounds.viewCamp));

router.post(
  "/",
  isLoggedin,
  upload.array("campground[image]"), // ✅ multer first
  validateCampground, // ✅ Joi next
  catchasync(campgrounds.createCamp) // ✅ controller
);

router.get("/:id/edit", isLoggedin, isAuthor, campgrounds.editCamp);

router.put(
  "/:id",
  isLoggedin,
  isAuthor,
  validateCampground,
  upload.array("image"),
  campgrounds.vieweditCamp
);

router.delete("/:id", isLoggedin, isAuthor, campgrounds.deleteCamp);

module.exports = router;
