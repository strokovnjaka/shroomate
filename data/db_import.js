const fs = require("fs");
const mongoose = require("mongoose");

let species = fs
  .readFileSync("./gobesi.csv", "utf8")
  .split("\n")
  .filter((v) => v.length > 0 && v.indexOf("url") == -1)
  .map((x) => {
    row = x.split(',')
    let y = {
      _id: { $oid: new mongoose.mongo.ObjectId() },
      url: row[0],
      latin_name: row[1],
      common_name: row[2],
    };
    return y;
  });

fs.writeFileSync(
  "./gobesi.json",
  JSON.stringify(species, null, 2)
);
