const express = require("express");
const router = express.Router();
const ctrlSightings = require("../controllers/sightings");
const ctrlOther = require("../controllers/other");

router.get("/", ctrlSightings.list);
router.get("/sighting", ctrlSightings.details);
router.get("/about", ctrlOther.about);

module.exports = router;
