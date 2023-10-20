const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *   Species:
 *    type: object
 *    description: Mushroom species.
 *    properties:
 *     common_name:
 *      type: string
 *      description: common name of the species
 *     latin_name:
 *      type: string
 *      description: latin name of the species
 *     description:
 *      type: string
 *      description: description of the species
 *    required:
 *     - common_name
 *     - latin_name
 *     - description
 */
const speciesSchema = mongoose.Schema({
  url: { type: String, required: [true, "url of description is required"] },
  latin_name: { type: String, required: [true, "latin name is required"] }, 
  common_name: { type: String, required: [true, "common name is required"] },
});

mongoose.model("Species", speciesSchema, "Species");
