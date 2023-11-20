const mongoose = require("mongoose");
const Sighting = mongoose.model("Sighting");
const Species = mongoose.model("Species");

/**
 * @openapi
 *  /sightings:
 *   get:
 *    summary: Retrieve sightings.
 *    description: Retrieve mushroom sightings that the user is authorized to see.
 *    tags: [Sightings]
 *    responses:
 *     '200':
 *      description: OK, with list of sightings.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Sighting'
 *        example:
 *         - _id: 635a62f5dc5d7968e68467e3
 *           name: Ljubljana - Cankarjeva spominska soba na Rožniku
 *           category: spominski objekti in kraji
 *           type: memorialna dediščina
 *           keywords: spominska soba
 *           description: Spominska soba, posvečena Ivanu Cankarju, je bila urejena leta 1948 in prenovljena v letih 1965 in 1998. Pisatelj je na Rožniku živel v letih 1910 - 1917, muzejsko postavitev je pripravil Mestni muzej Ljubljana.
 *           sighting: Spominska soba je urejena v stavbi, ki stoji nasproti gostilne Rožnik, na Cankarjevem vrhu (Rožnik).
 *           institution: ZVKD Ljubljana
 *           heritage: neznano
 *           municipality: LJUBLJANA
 *           coordinates: [14.4765778196, 46.0557820208]
 *           synonyms: [Cankarjev vrh]
 *           datation: 20. stol., 1948, 1965, 1998
 *           authors: Mestni muzej Ljubljana (arhitekt; 1948)
 *           fields: [zgodovina]
 *           distance: 858.0692052049162
 *     '500':
 *      description: Internal Server Error, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: database not available
 */
const sightingsGet = async (req, res) => {
  try {
    let sightings = await Sighting.find();
    res.status(200).json(sightings || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const sightingsListByMultiFilter = async (req, res) => {
//   let filter = [];
//   // Exclude fields
//   filter.push({ $project: { comments: false, id: false } });
//   // Filter by codelist if provided
//   allowedCodelists.forEach((codelist) => {
//     let value = req.query[codelist];
//     if (value) filter.push({ $match: { [codelist]: value } });
//   });
//   // Maximum number of results
//   let nResults = parseInt(req.query.nResults);
//   nResults = isNaN(nResults) ? 10 : nResults;
//   filter.push({ $limit: nResults });
//   // Perform database search and return results
//   try {
//     let sightings = await Sighting.aggregate(filter).exec();
//     if (!sightings || sightings.length === 0)
//       res.status(404).json({ message: "no sightings found" });
//     else res.status(200).json(sightings);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

/**
 * @openapi
 * /sightings/{sightingId}:
 *   get:
 *    summary: Retrieve details of a given sighting.
 *    description: Retrieve **cultural heritage details** for a given sighting.
 *    tags: [Sightings]
 *    parameters:
 *    - name: sightingId
 *      in: path
 *      required: true
 *      description: unique identifier of sighting
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      example: 635a62f5dc5d7968e68464c1
 *    responses:
 *     '200':
 *      description: OK, with sighting details.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Sighting'
 *        example:
 *         _id: 65315b19511c9919cb1dbe1b
 *         visibility: everyone
 *         note: A note
 *         timestamp: 2023-10-19T16:35:50.428Z
 *         photos:
 *          filename: 531721270368bd696acbf21521536592.jpg
 *          _id: 65315b19511c9919cb1dbe1c
 *         user: 652e5a75857292e98c67fac3
 *         species: 652d2b2d73d0068591bd1200
 *         position: [15.424,49.323]
 *     '404':
 *      description: Not Found, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: sighting not found
 *     '500':
 *      description: Internal Server Error, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: database not available
 */
const sightingsIdGet = async (req, res) => {
  try {
    let sighting = await Sighting.findById(req.params.sightingId);
    if (!sighting)
      return res.status(404).json({ message: "sighting not found" });
    res.status(200).json(sighting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /sightings:
 *  post:
 *   summary: Add a sighting.
 *   description: Add a new sighting.
 *   tags: [Sightings]
 *   security:
 *    - jwt: []
 *   requestBody:
 *    description: Comment's author, rating and content.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        species:
 *         type: string
 *         pattern: '^[a-fA-F\d]{24}$'
 *         description: unique identifier of species
 *         example: 635a62f5dc5d7968e6846914
 *        visibility:
 *         type: string
 *         enum: [me, friends, everyone]
 *         description: visibility of sighting
 *         example: me
 *        note:
 *         type: string
 *         description: note about the sighting
 *        lon:
 *         type: number
 *         description: longitude of sighting's position
 *         example: 14.488902311611735
 *        lat:
 *         type: number
 *         description: latitude of sighting's position
 *         example: 46.05794020972986
 *        timestamp:
 *         type: string
 *         format: date-time
 *         description: timestamp of when the sighting was made
 *        photos:
 *         type: array
 *         items:
 *          type: string
 *          format: binary
 *         description: photos of the sighting
 *         minItems: 1
 *         maxItems: 3
 *       required:
 *        - user
 *        - species
 *        - lon
 *        - lat
 *        - photos
 *   responses:
 *    '201':
 *     description: Created, with comment details.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Sighting'
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        locationId is required:
 *         value:
 *          message: path parameter 'locationId' is required
 *        author, rating and comment are required:
 *         value:
 *          message: body parameters 'author', 'rating' and 'comment' are required
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
 *    '404':
 *     description: Not Found, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: location not found.
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const sightingsPost = async (req, res) => {
  try {
    const { species, visibility, note, lon, lat, timestamp } = req.body;
    if (!species || !lon || !lat)
      return res.status(400).json({ message: "body parameters 'species', 'lon', and 'lat' are required" });
    if (!Array.isArray(req.files) || req.files.length < 1 || req.files.length > 3)
      return res.status(400).json({ message: "one to three photos required" });
    if (!(await Species.findById(species)))
      return res.status(404).json({ message: "species not found" });
    const sighting = new Sighting();
    sighting.user = req.auth._id;
    sighting.species = species;
    sighting.position = [lon, lat];
    if (visibility) 
      sighting.visibility = visibility;
    if (note)
      sighting.note = note;
    if (timestamp)
      sighting.timestamp = timestamp;
    for (const f of req.files) {
      console.log(f);
      sighting.photos.push({
        fileid: f.id,
        filename: f.filename,
      })
    }
    console.log(sighting);
    await sighting.save();
    res.status(200).json(sighting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sightingsGet,
  sightingsPost,
  sightingsIdGet,
};
