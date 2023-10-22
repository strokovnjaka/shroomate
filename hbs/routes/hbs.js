const express = require("express");
const router = express.Router();
const ctrlSightings = require("../controllers/sightings");
const ctrlOther = require("../controllers/other");
const crtlDb = require("../controllers/db");

router.get("/", ctrlSightings.list);
router.get("/sighting", ctrlSightings.details);
router.get("/db/init", crtlDb.init);
router.get("/db/drop", crtlDb.drop);
router.get("/about", ctrlOther.about);

module.exports = router;
