const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *  schemas:
 *   Message:
 *    type: object
 *    description: Message from a user to a user.
 *    properties:
 *     from_user:
 *      type: Schema.Types.ObjectId
 *      description: unique identifier of the sender user
 *     to_user:
 *      type: Schema.Types.ObjectId
 *      description: unique identifier of the recipient user
 *     content:
 *      type: string
 *      description: message content
 *    required:
 *     - from_user
 *     - to_user
 *     - content
 */
const messageSchema = mongoose.Schema({
  from_user: { type: Schema.Types.ObjectId, required: [true, "from user is required"] },
  to_user: { type: Schema.Types.ObjectId, required: [true, "to user is required"] },
  content: { type: String, required: [true, "content is required"] },
});

mongoose.model("Message", messageSchema, "Messages");
