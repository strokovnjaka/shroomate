const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const randtoken = require('rand-token');
require('../helpers/email')

/**
 * @openapi
 * /signup:
 *  post:
 *   summary: Sign up a new user
 *   description: Sign up a new user with name, email and password.
 *   tags: [Authentication]
 *   requestBody:
 *    description: User object with name, email and password attributes set.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: new user's email 
 *         pattern: '^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$'
 *         example: joe@shrooma.te
 *        name:
 *         type: string
 *         description: new user's name
 *         example: Joe Boletus
 *        password:
 *         type: string
 *         description: new user's password
 *         example: testis
 *       required:
 *        - email
 *        - name
 *        - password
 *   responses:
 *    '200':
 *     description: Sign up successful, verification link has been sent to your email.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Authentication'
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: All fields required.
 *    '409':
 *     description: Conflict, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: this account is already taken
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const signup = async (req, res) => {
  try {
    // see register in https://github.com/Arihantjain1/registration_with_email_verification
    if (!req.body.name || !req.body.email || !req.body.password)
      return res.status(400).json({ message: "all fields required." });
    if (await User.findOne({ $or: [{ email: req.body.email }, { name: req.body.name }]}).exec())
      return res.status(409).json({ message: "this account is already taken" });
    // TODO: check if email already exists
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    await user.save();
    console.log(user.email, user.signup_token);
    // TODO: instead use verification email as below
    // res.status(200).json({ token: user.generateJwt() });
    // send_email(user.email, 'verify_account', { link: 'http://localhost:3000/verify/', token: user.signup_token })
    //   .then(() => {
        res.status(200).json({
          message: "Sign up successful, verification link will be sent to your email; for now email and signup token are attached...",
          token: user.signup_token,
          email: user.email,
        })
    //   })
    //   .catch(error => {
    //     res.status(500).json({ message: error });
    //   });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /verify:
 *  get:
 *   summary: Verify a new user's account
 *   description: Verify account with a token sent by email upon signup.
 *   tags: [Authentication]
 *   parameters:
 *    - name: email
 *      in: query
 *      schema:
 *       type: string
 *       pattern: '^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$'
 *      required: true
 *      description: email as account identifier
 *      example: joe@shrooma.te
 *    - name: token
 *      in: query
 *      schema:
 *       type: string
 *       pattern: '^[A-Za-z0-9]{30}$'
 *      required: true
 *      description: random token of the account
 *      example: nPLtC44kDkfc1YG0pWiXifPcnoYFlc
 *   responses:
 *    '200':
 *     description: OK, with JWT token.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Authentication'
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: All fields required.
 *    '404':
 *     description: Not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        email and/or token not found or already used:
 *         value:
 *          message: "email and/or token not found or already used."
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const verify = async (req, res) => {
  try {
    if (!req.query.email || !req.query.token)
      return res.status(400).json({ message: "all fields required." });
    let user = await User.findOne({email: req.query.email, signup_token: req.query.token, enabled: false});
    if (!user)
      return res.status(404).json({ message: "email and/or token not found or already used" });
    user.enabled = true;
    await user.save();
    res.status(200).json({ token: user.generateJwt() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /login:
 *  post:
 *   summary: Login a user
 *   description: Login an existing user with email and password.
 *   tags: [Authentication]
 *   requestBody:
 *    description: User credentials
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         format: email
 *         description: email of the user
 *         example: joe@shrooma.te
 *        password:
 *         type: string
 *         description: password of the user
 *         example: testis
 *       required:
 *        - email
 *        - password
 *   responses:
 *    '200':
 *     description: OK, with JWT token.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Authentication'
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: All fields required.
 *    '401':
 *     description: Unauthorized, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        account disabled:
 *         value:
 *          message: account has been disabled
 *        incorrect login:
 *         value:
 *          message: incorrect login
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const login = (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res.status(400).json({ message: "all fields required." });
    else
      passport.authenticate("local", (err, user, info) => {
        if (err) 
          return res.status(500).json({ message: err.message });
        if (!user) 
          return res.status(401).json({ message: info.message });
        if (!user.enabled)
          return res.status(401).json({ message: "account has been disabled" });
        const { hash, salt, signup_token, ...rest } = user.toObject();
        return res.status(200).json({ token: user.generateJwt(), user: rest });
      })(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  verify,
  login,
};
