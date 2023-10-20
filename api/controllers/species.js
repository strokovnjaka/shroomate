const mongoose = require("mongoose");
const Species = mongoose.model("Species");

/**
 * @openapi
 * /species:
 *   get:
 *    summary: Retrieve species.
 *    description: Retrieve available mushroom species.
 *    tags: [Species]
 *    responses:
 *     '200':
 *      description: OK, with list of species.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Species'
 *        example:
 *         - _id: 635a62f5dc5d7968e68467e3
 *           url: https://www.gobe.si/Gobe/AmanitaMuscaria
 *           latin_name: Amanita muscaria
 *           common_name: rdeča mušnica
 *     '404':
 *      description: Not Found, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: no species found
 *     '500':
 *      description: Internal Server Error, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: database not available
 */
const speciesGet = async (req, res) => {
  try {
    let species = await Species.find().limit(50);
    if (!species)
      res.status(404).json({ message: "no species found" });
    else 
      res.status(200).json(species);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  speciesGet,
};
