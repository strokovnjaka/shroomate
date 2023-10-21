const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const User = mongoose.model("User");
const Types = require('mongoose').Types

/**
 * @openapi
 * /messages:
 *  get:
 *   summary: get messages for the logged in user.
 *   description: Retrieve messages that the logged in user either sent or received.
 *   tags: [Messages]
 *   security:
 *    - jwt: []
 *   responses:
 *    '200':
 *     description: OK, with a list of messages.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: unique identifier of message
 *          example: 635a62f5dc5d7968e6846574
 *         sender_id:
 *          type: string
 *          description: unique identifier of sender
 *          example: 635a62f5dc5d7968e6846574
 *         sender_name:
 *          type: string
 *          description: sender's name
 *          example: John Doe
 *         recipient_id:
 *          type: string
 *          description: unique identifier of recipient
 *          example: 635a62f5dc5d7968e6846574
 *         recipient_name:
 *          type: string
 *          description: recipient's name
 *          example: Jane Doe
 *         content:
 *          type: string
 *          description: message content
 *          example: I dig you!
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const messagesGet = async (req, res) => {
  try {
    let messages = await Message.aggregate([
      {
        $match: { $or: [
          { from_user: new Types.ObjectId(req.auth._id) },
          { to_user: new Types.ObjectId(req.auth._id) },
        ] },
      },
      {
        $lookup: {
          from: "Users",
          localField: "from_user",
          foreignField: "_id",
          as: "sa",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "to_user",
          foreignField: "_id",
          as: "ra",
        }
      },
      {
        $project: {
          s: { $arrayElemAt: ["$sa", 0] },
          r: { $arrayElemAt: ["$ra", 0] },
          content: "$content",
        }
      },
      {
        $project: {
          sender_name: "$s.name",
          sender_id: "$s._id",
          recipient_name: "$r.name",
          recipient_id: "$r._id",
          content: "$content",
        }
      },
    ]);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /messages:
 *  post:
 *   summary: Add a new message.
 *   description: Add a new message from logged in user to recipient user.
 *   tags: [Messages]
 *   security:
 *    - jwt: []
 *   requestBody:
 *    description: Message recipient and content.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        recipient:
 *         type: string
 *         pattern: '^[a-fA-F\d]{24}$'
 *         description: unique identifier of location
 *         example: 635a62f5dc5d7968e6846914
 *        content:
 *         type: string
 *         description: message content
 *         example: Found a trophy muscaria!
 *       required:
 *        - recipient
 *        - content
 *   responses:
 *    '201':
 *     description: Created, with message details.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Message'
 *    '400':
 *     description: Bad Request, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: body parameters 'recipient' and 'content' are required
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
 *        message: user not found
 *    '409':
 *     description: Conflict, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: cannot send message to self
 *    '500':
 *     description: Internal Server Error, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: database not available
 */
const messagesPost = async (req, res) => {
  try {
    if (!req.body.recipient || !req.body.content)
      return res.status(400).json({ message: "body parameters 'recipient' and 'content' are required" });
    if (req.body.recipient === req.auth._id)
      return res.status(409).json({ message: "cannot send message to self" });
    let to_user = await User.findById(req.body.recipient).select("_id").exec();
    if (!to_user)
      return res.status(404).json({ message: "user not found" });
    const message = new Message();
    message.from_user = req.auth._id;
    message.to_user = to_user._id;
    message.content = req.body.content;
    await message.save();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  messagesGet,
  messagesPost,
};
