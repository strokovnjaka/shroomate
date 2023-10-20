const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const randtoken = require('rand-token');
const Schema = mongoose.Schema;

/**
 * @openapi
 *  components:
 *   schemas:
 *    User:
 *     type: object
 *     description: User account of the application.
 *     properties:
 *      email:
 *       type: string
 *       format: email
 *       description: email of the user
 *       example: joe@shrooma.te
 *      name:
 *       type: string
 *       description: name of the user
 *       example: Hey Joe
 *      password:
 *       type: string
 *       description: password for the user account
 *       example: test
 *      enabled:
 *       type: boolean
 *       description: flag for enabling the account
 *      admin:
 *       type: boolean
 *       description: flag for admin account
 *      location_friends:
 *       type: string
 *       enum: [micro, macro, region]
 *      location_everyone:
 *       type: string
 *       enum: [micro, macro, region]
 *      friends:
 *       type: array
 *       items:
 *        type: Schema.Types.ObjectId
 *        description: unique identifier of friend user
 *     required:
 *      - email
 *      - name
 *      - password
 *    Authentication:
 *     type: object
 *     description: Authentication token of the user.
 *     properties:
 *      token:
 *       type: string
 *       description: JWT token
 *       example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTZiZWRmNDhmOTUzOTViMTlhNjc1ODgiLCJlbWFpbCI6InNpbW9uQGZ1bGxzdGFja3RyYWluaW5nLmNvbSIsIm5hbWUiOiJTaW1vbiBIb2xtZXMiLCJleHAiOjE0MzUwNDA0MTgsImlhdCI6MTQzNDQzNTYxOH0.GD7UrfnLk295rwvIrCikbkAKctFFoRCHotLYZwZpdlE
 *     required:
 *      - token
 */
const usersSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: [true, "email is required"] },
  name: { type: String, unique: true, required: [true, "name is required"] },
  hash: { type: String, required: [true, "hash is required"] },
  salt: { type: String, required: [true, "salt is required"] },
  signup_token: { type: String, default: randtoken.generate(30) },
  enabled: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  location_friends: { 
    type: String, 
    default: 'macro',
    // required: [true, "location garbling method for friends is required"],
    validate: {
      validator: (v) => ['micro','macro','region'].includes(v),
      message: "Location garbling method for friends has to be one of 'micro','macro', or 'region'!",
    },
  },
  location_everyone: { 
    type: String,
    default: 'macro',
    // required: [true, "location garbling method for everyone is required"],
    validate: {
      validator: (v) => ['micro', 'macro', 'region'].includes(v),
      message: "Location garbling method for everyone has to be one of 'micro','macro', or 'region'!",
    },
  },
  friends: {
    type: [Schema.Types.ObjectId],
  },
});

usersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

usersSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

usersSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
      enabled: this.enabled,
      admin: this.admin,
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("User", usersSchema, "Users");
