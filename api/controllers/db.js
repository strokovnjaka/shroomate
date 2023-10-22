const mongoose = require("mongoose");
const Species = mongoose.model("Species");
const User = mongoose.model("User");

const dbDrop = async (req, res) => {
  try {
    mongoose.connection.db.dropDatabase(function (err, result) {
      if (err)
        return res.status(500).json({ message: err.message });
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const dbInit = async (req, res) => {
  try {
    await mongoose.connection.db.dropDatabase(function (err, result) {
      if (err)
        return res.status(500).json({ message: err.message });
    });
    // load species and users
    const species = require('../../data/db_species.json');
    // const species = [{ "url": "https://www.gobe.si/Gobe/AbortiporusBiennis", "latin_name": "Abortiporus biennis", "common_name": "dvoletni polluknjičar" }];
    const users = require('../../data/db_users.json');
    // insert species and users
    await User
      .insertMany(users)
      .then(function(docs) {
        console.log(`inserted ${docs.length} users`);
      })
      .catch(function(err) {
        return res.status(500).json({ message: err.message });
      });
    await Species
      .insertMany(species)
      .then(function (docs) {
        console.log(`inserted ${docs.length} species`);
      })
      .catch(function (err) {
        return res.status(500).json({ message: err.message });
      });
    // console.log("init db successful");
    // Species.insertMany(species);
    // console.log("species done");
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  dbDrop,
  dbInit,
};
