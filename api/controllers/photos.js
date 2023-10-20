const mongoose = require("mongoose");

/**
 * @openapi
 * /photos/{filename}:
 *   get:
 *    summary: Retrieve saved photo.
 *    description: Retrieve **cultural heritage details** for a given sighting.
 *    tags: [Sightings]
 *    parameters:
 *    - name: filename
 *      in: path
 *      required: true
 *      description: filename of the requested photo
 *      schema:
 *       type: string
 *      example: 635a62f5dc5dwdfd7968e68464c1.jpg
 *    responses:
 *     '200':
 *      description: OK, with photo
 *      content:
 *       image/*:
 *        schema:
 *         type: string
 *         format: binary
 *     '404':
 *      description: Not Found, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        examples:
 *         not found:
 *          message: photo not found
 *     '500':
 *      description: Internal Server Error, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: error downloading file
 */
const photosFilenameGet = (gfs) => {
  return async (req, res) => {
    try {
      const { filename } = req.params;
      return gfs
        .openDownloadStreamByName(filename)
        .on('error', e => {
          res.status(404).json({ message: "photo not found" });
        })
        .pipe(res)
        .on('error', e => {
          res.status(500).json({ message: "error downloading file" });
        });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

module.exports = {
  photosFilenameGet,
};
