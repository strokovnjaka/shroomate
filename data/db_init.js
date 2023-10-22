const fs = require("fs");
// const mongoose = require("mongoose");

let species = fs
  .readFileSync("./gobesi.csv", "utf8")
  .split("\n")
  .filter((v) => v.length > 0 && v.indexOf("url") == -1)
  .map((x) => {
    row = x.split(',')
    let y = {
      // _id: { $oid: new mongoose.mongo.ObjectId() },
      url: row[0],
      latin_name: row[1],
      common_name: row[2],
    };
    return y;
  });

fs.writeFileSync("./db_species.json", JSON.stringify(species));

let users = [{
  name: 'admin',
  email: 'admin@shrooma.te',
  salt: '0e703f0afdef78d7fa439e0e4aa0d852',
  hash: '61bf5da70186335f3312bc88323a30a6588fb6433d104d6a9cda20635569ed8b4eebaf5128fce45d74c83cbed713964ad948731ffbed205e0038fdeb6cbae23a',
  enabled: true,
  admin: true,
}];

fs.writeFileSync("./db_users.json", JSON.stringify(users));
