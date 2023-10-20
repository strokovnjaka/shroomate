const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *  schemas:
 *   Photo:
 *    type: object
 *    description: Photo, usually of a sighting.
 *    properties:
 *     filename:
 *      type: string
 *      description: filename of the photo
 *      example: 90809b8ac98ba98cb9b90a888.png
 *    required:
 *     - filename
 */
const photoSchema = new mongoose.Schema({
  filename: { type: String, required: [true, "file name is required"] },
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Sighting:
 *    type: object
 *    description: Sighting of mushroom.
 *    properties:
 *     user:
 *      type: Schema.Types.ObjectId
 *      description: unique identifier of the authoring user
 *     species:
 *      type: Schema.Types.ObjectId
 *      description: unique identifier of the species of sighting
 *     visibility:
 *      type: string
 *      description: visibility of the sighting per user type
 *      enum: [me, friends, everyone]
 *     note:
 *      type: string
 *      description: note about the sighting
 *     position:
 *      type: array
 *      items:
 *       type: number
 *      minItems: 2
 *      maxItems: 2
 *      description: position coordinates of the sighting
 *     timestamp:
 *      type: string
 *      format: date-time
 *      description: timestamp of when the sighting was made
 *     photos:
 *      type: array
 *      $ref: '#/components/schemas/Photo'
 *      minItems: 1
 *      maxItems: 3
 *    required:
 *     - user
 *     - species
 *     - position
 *     - photos
 */
const sightingSchema = mongoose.Schema({
  user: { type: Schema.Types.ObjectId, required: [true, "user is required"] },
  species: { type: Schema.Types.ObjectId, required: [true, "species is required"] },
  visibility: {
    type: String,
    default: 'everyone',
    validate: {
      validator: (v) => ['me', 'friends', 'everyone'].includes(v),
      message: "visibility has to be one of 'me', 'friends', or 'everyone'",
    },
  },
  note: { type: String, default: '' },
  position: {
    type: [Number],
    required: [true, "position is required"],
    validate: {
      validator: (v) => Array.isArray(v) && v.length == 2,
      message: "position must be an array of two numbers",
    },
    index: "2dsphere",
  },
  timestamp: { type: Date, default: Date.now() },
  photos: { 
    type: [photoSchema],
    required: [true, "photos is required"],
    validate: {
      validator: (v) => Array.isArray(v) && v.length >= 1 && v.length <= 3,
      message: "photos must be a collection of Photos",
    },
  },
});

mongoose.model("Sighting", sightingSchema, "Sightings");
