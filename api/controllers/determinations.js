const mongoose = require("mongoose");
const Determination = mongoose.model("Determination");
const Species = mongoose.model("Species");
const Sighting = mongoose.model("Sighting");

/**
 * @openapi
 * /determinations:
 *  post:
 *   summary: Add a new determination to an existing sighting.
 *   description: Add a new **comment** with author's name, rating and comment's content to a location with given unique identifier.
 *   tags: [Determinations]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: determinationId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: unique identifier of location
 *      required: true
 *      example: 635a62f5dc5d7968e6846914
 *   requestBody:
 *    description: Determination with all the details.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        sighting:
 *         type: string
 *         pattern: '^[a-fA-F\d]{24}$'
 *         description: unique identifier of sighting
 *         example: 635a62f5dc5d7968e6846914
 *        species:
 *         type: string
 *         pattern: '^[a-fA-F\d]{24}$'
 *         description: unique identifier of species
 *         example: 635a62f5dc5d7968e6846914
 *        timestamp:
 *         type: string
 *         description: timestamp of sighting
 *         example: 2023-10-19T16:35:50.428Z
 *        required:
 *        - sighting
 *        - species
 *   responses:
 *    '201':
 *     description: Created, with determination details.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Determination'
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Body parameters 'sighting' and 'species' are required.
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
 *          message: User not found.
 *    '404':
 *     description: Not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: sighting and/or species not found
 *    '409':
 *     description: Conflict, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: determination for this sighting from this user already exists
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const determinationsPost = async (req, res) => {
  try {
    const { sighting, species, timestamp } = req.body;
    if (!sighting || !species)
      return res.status(400).json({ message: "body parameters 'sighting' and 'species' are required" });
    if (!(await Sighting.findById(sighting).exec()) ||
      !(await Species.findById(species).exec()))
      return res.status(404).json({ message: "sighting and/or species not found" });
    if (await Determination.find({user: req.auth._id, sighting: sighting}))
      return res.status(409).json({ message: "determination for this sighting from this user already exists" });
    const determination = new Determination();
    determination.sighting = sighting;
    determination.user = req.auth._id;
    determination.species = species;
    if (timestamp) 
      determination.timestamp = timestamp;
    await determination.save();
    res.status(200).json(determination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /determinations/{determinationId}:
 *  delete:
 *   summary: Delete existing species determination.
 *   description: Delete existing species determination with given unique identifier.
 *   tags: [Determinations]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: determinationId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: unique identifier of determination
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
 *        message: path parameter 'determinationId' is required
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
 *          message: User not found.
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
 *        message: not authorized to delete this determination
 *    '404':
 *     description: Not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        determination not found:
 *         value:
 *          message: determination not found
 *        determination not deleted:
 *         value:
 *          message: determination not deleted
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const determinationsIdDelete = async (req, res) => {
  try {
    const { determinationId } = req.params;
    if (!determinationId)
      return res.status(400).json({ message: "path parameter 'determinationId' is required" });
    let determination = await Determination.findById(determinationId).exec();
    if (!determination)
      return res.status(404).json({ message: "determination not found" });
    if (determination.user != req.auth._id && !req.auth?.admin)
      return res.status(403).json({ message: "not authorized to delete this determination" });
    if ((await User.deleteOne({ _id: determinationId })).deletedCount !== 1)
      return res.status(404).json({ message: "determination not deleted" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  determinationsPost,
  // determinationsGet,
  // determinationsIdPut,
  determinationsIdDelete,
};
