const mongoose = require("mongoose");
const User = mongoose.model("User");

/**
 * @openapi
 * /users:
 *  get:
 *   summary: Retrieve all users.
 *   description: Retrieve all users of shroomate, with only _id and name attributes.
 *   tags: [Users]
 *   responses:
 *    '200':
 *     description: OK, with list of users.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Species'
 *       example:
 *        - _id: 635a62f5dc5d7968e68467e3
 *          name: Joe Doe
 *        - _id: 635a62f5dc5d7968e4353554
 *          name: Jane Doe
 *    '404':
 *     description: Not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: no users found
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const usersGet = async (req, res) => {
  try {
    let users = await User.find().select("_id name").exec();
    if (!users)
      res.status(404).json({ message: "no users found" });
    else 
      res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /users/{userId}:
 *  get:
 *   summary: Retrieve details of a given user.
 *   description: Retrieve details for a given user.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *   - name: userId
 *     in: path
 *     required: true
 *     description: unique identifier of user
 *     schema:
 *      type: string
 *      pattern: '^[a-fA-F\d]{24}$'
 *     example: 635a62f5dc5d7968e68464c1
 *   responses:
 *    '200':
 *     description: OK, with user details.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *       example:
 *        _id: 652e5a75857292e98c67fac3
 *        enabled: true
 *        admin: false
 *        location_friends: macro
 *        location_everyone: macro
 *        friends: []
 *        name: admin
 *        email: admin@shrooma.te
 *    '401':
 *     description: Unauthorized, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        no token provided:
 *         value:
 *          message: no authorization token was found
 *        user not found:
 *         value:
 *          message: user not found
 *        malformed token:
 *         value:
 *          message: jwt malformed
 *        invalid token signature:
 *         value:
 *          message: invalid signature
 *     '403':
 *      description: Forbidden, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: not authorized to get this user
 *     '404':
 *      description: Not Found, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: user not found
 *     '500':
 *      description: Internal Server Error, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: database not available
 */
const usersIdGet = async (req, res) => {
  try {
    if (req.auth?._id !== req.params.userId && !req.auth?.admin)
      return res.status(403).json({ message: "not authorized to view this user" });
    let user = await User.findById(req.params.userId).select("-signup_token -hash -salt").exec();
    if (!user)
      return res.status(404).json({ message: "user not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /users/{userId}:
 *  put:
 *   summary: Change existing user details.
 *   description: Change existing user details.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: userId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: unique identifier of user
 *      required: true
 *      example: 635a62f5dc5d7968e6846914
 *   requestBody:
 *    description: User's details to update.
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
 *        name:
 *         type: string
 *         description: name of the user
 *         example: Hey Joe
 *        password:
 *         type: string
 *         description: password for the user account
 *         example: test
 *        enabled:
 *         type: boolean
 *         description: flag for enabling the account
 *        admin:
 *         type: boolean
 *         description: flag for admin account
 *        location_friends:
 *         type: string
 *         enum: [micro, macro, region]
 *        location_everyone:
 *         type: string
 *         enum: [micro, macro, region]
 *        friends:
 *         type: array
 *         items:
 *          type: string
 *          pattern: '^[a-fA-F\d]{24}$'
 *          description: unique identifier of friend user
 *   responses:
 *    '200':
 *     description: OK, with updated user details.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        userId is required:
 *         value:
 *          message: path parameter 'userId' is required
 *        rating or comment is required:
 *         value:
 *          message: at least one of body parameters for user is required
 *    '401':
 *     description: Unauthorized, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        no token provided:
 *         value:
 *          message: no authorization token was found
 *        user not found:
 *         value:
 *          message: user not found
 *        malformed token:
 *         value:
 *          message: jwt malformed
 *        invalid token signature:
 *         value:
 *          message: invalid signature
 *    '403':
 *     description: Forbidden, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: not authorized to update this user
 *    '404':
 *     description: Not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: user not found
 *    '409':
 *     description: Conflict, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        name taken:
 *         value:
 *          message: name already taken
 *        email taken:
 *         value:
 *          message: email already taken
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const usersIdUpdate = async (req, res) => {
  try {
    if (!req.params.userId)
      return res.status(400).json({ message: "path parameter 'userId' is required" });
    if (req.auth?._id !== req.params.userId && !req.auth?.admin)
      return res.status(403).json({ message: "not authorized to update this user" });
    let user = await User.findById(req.params.userId).exec();
    if (!user)
      return res.status(404).json({ message: "user not found" });
    const { 
      email, name, password, enabled, admin, 
      location_friends, location_everyone, friends 
    } = req.body;
    if (!email && !name && !password && !enabled && !admin &&
        !location_friends && !location_everyone && !friends)
      return res.status(400).json({ message: "at least one of body parameters for user is required" });
    if (enabled) user.enabled = enabled;
    if (admin) user.admin = admin;
    if (location_friends) user.location_friends = location_friends;
    if (location_everyone) user.location_everyone = location_everyone;
    if (friends) user.friends = friends;
    if (password) user.password = password;
    if (name) {
      if (await User.findOne({ name: name, _id: { $ne: req.params.userId }}).exec())
        return res.status(409).json({ message: "name already taken" });
      user.name = name;
    }
    if (email) {
      if (await User.findOne({ email: req.body.email, _id: { $ne: req.params.userId } }).exec())
        return res.status(409).json({ message: "email already taken" });
      user.email = req.body.email;
    }
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /users/{userId}:
 *  delete:
 *   summary: Delete existing user.
 *   description: Delete existing user.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: userId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: unique identifier of user
 *      required: true
 *      example: 635a62f5dc5d7968e6846914
 *   responses:
 *    '204':
 *     description: No Content, with no content.
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: path parameter 'userId' is required
 *    '401':
 *     description: Unauthorized, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        no token provided:
 *         value:
 *          message: no authorization token was found
 *        user not found:
 *         value:
 *          message: user not found
 *        malformed token:
 *         value:
 *          message: jwt malformed
 *        invalid token signature:
 *         value:
 *          message: invalid signature
 *    '403':
 *     description: Forbidden, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: not authorized to delete this user
 *    '404':
 *     description: Not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        user not found:
 *         value:
 *          message: user not found
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const usersIdDelete = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ message: "path parameter 'userId' is required" });
    if (!req.auth?.admin || req.auth._id === userId)
      return res.status(403).json({ message: "not authorized to delete this user" });
    if((await User.deleteOne({_id: userId})).deletedCount !== 1)
      return res.status(404).json({ message: "user not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  usersGet,
  usersIdGet,
  usersIdUpdate,
  usersIdDelete,
};
