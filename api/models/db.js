const mongoose = require("mongoose");
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require("path");

let dbURI = "mongodb://127.0.0.1/shroomate";
if (process.env.NODE_ENV === "production")
  dbURI = process.env.MONGODB_ATLAS_URI;
else if (process.env.NODE_ENV === "test")
  dbURI = "mongodb://web-dev-mongo-db/shroomate";

let connection = mongoose.connect(dbURI);

// create GridFS storage engine
const storage = new GridFsStorage({
  db: connection,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      console.log('file', file);
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          encoding: file.encoding,
          mimetype: file.mimetype,
        };
        console.log('new fileInfo', fileInfo);
        resolve(fileInfo);
      });
    });
  }
});

storage.on('connection', (db) => {
  console.log('gridfs storage connected');
});

storage.on('connectionFailed', (err) => {
  console.log('gridfs storage connection faild');
});

const upload = multer({ storage });

mongoose.connection.on("connected", () =>
  console.log(`mongoose connected to ${dbURI.replace(/:.+?@/, ":*****@")}.`)
);

mongoose.connection.on("error", (err) =>
  console.log(`mongoose connection error: ${err}.`)
);

mongoose.connection.on("disconnected", () =>
  console.log("mongoose disconnected")
);

const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`mongoose disconnected through ${msg}.`);
  callback();
};

process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () =>
    process.kill(process.pid, "SIGUSR2")
  );
});

process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => process.exit(0));
});

process.on("SIGTERM", () => {
  gracefulShutdown("cloud-based app shutdown", () => process.exit(0));
});

require("./determinations");
require("./messages");
require("./sightings");
require("./species");
require("./users");

module.exports = upload;