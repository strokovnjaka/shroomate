const mongoose = require("mongoose"); 
const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");

const jwt_config = {
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
};
const auth = jwt(jwt_config);

jwt_config.credentialsRequired = false;
const authOrNo = jwt(jwt_config);

const ctrlAuthentication = require("../controllers/authentication");
const ctrlDeterminations = require("../controllers/determinations");
const ctrlMessages = require("../controllers/messages");
const ctrlPhotos = require("../controllers/photos");
const ctrlSightings = require("../controllers/sightings");
const ctrlSpecies = require("../controllers/species");
const ctrlUsers = require("../controllers/users");
const ctrlDb = require("../controllers/db");

module.exports = (upload) => {
  let gfs;

  mongoose.connection.once('open', () => {
    // initialize GridFS stream
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    console.log("mongoose created gridfs 'uploads' bucket")
    router.get("/photos/:filename", ctrlPhotos.photosFilenameGet(gfs));
  });

  /**
   * Authentication
   */
  router.post("/signup", ctrlAuthentication.signup);
  router.get("/verify", ctrlAuthentication.verify);
  router.post("/login", ctrlAuthentication.login);

  /**
   * Determinations
   */
  router.route("/determinations")
        .post(auth, ctrlDeterminations.determinationsPost)
  router.route("/determinations/:determinationId")
        .delete(auth, ctrlDeterminations.determinationsIdDelete);

  /**
   * Messages
   */
  router.route("/messages")
        .get(auth, ctrlMessages.messagesGet)
        .post(auth, ctrlMessages.messagesPost);

  /**
   * Sightings
   */
  router.route("/sightings")
        .get(authOrNo, ctrlSightings.sightingsGet)
        .post(auth, upload.array('photos',3), ctrlSightings.sightingsPost);
  router.get("/sightings/:sightingId", ctrlSightings.sightingsIdGet);

  /**
   * Species
   */
  router.get("/species", ctrlSpecies.speciesGet);

  /**
   * Users
   */
  router.get("/users", ctrlUsers.usersGet);
  router.route("/users/:userId")
    .get(auth, ctrlUsers.usersIdGet)
    .put(auth, ctrlUsers.usersIdUpdate)
    .delete(auth, ctrlUsers.usersIdDelete);

  /**
   * DB tools
   */
  router.get("/db/drop", ctrlDb.dbDrop);
  router.get("/db/init", ctrlDb.dbInit);

  return router;
};
