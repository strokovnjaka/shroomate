const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *  schemas:
 *   Determination:
 *    type: object
 *    description: Determination of species by a user.
 *    properties:
 *     sighting:
 *      type: Schema.Types.ObjectId
 *      description: unique identifier of the respective sighting
 *     user:
 *      type: Schema.Types.ObjectId
 *      description: unique identifier of the author of the determination
 *     species:
 *      type: Schema.Types.ObjectId
 *      description: unique identifier of the determined species of the sighting
 *     timestamp:
 *      type: string
 *      format: date-time
 *      description: timestamp of when the determination was made
 *    required:
 *     - sighting
 *     - user
 *     - species
 */
const determinationSchema = mongoose.Schema({
  sighting: { type: Schema.Types.ObjectId, required: [true, "sighting is required"] },
  user: { type: Schema.Types.ObjectId, required: [true, "user is required"] },
  species: { type: Schema.Types.ObjectId, required: [true, "species is required"] },
  timestamp: { type: Date, default: Date.now() },
});

mongoose.model("Determination", determinationSchema, "Determinations");
