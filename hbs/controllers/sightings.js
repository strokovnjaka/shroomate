const apiServer =
  process.env.NODE_ENV === "production"
    ? "https://shroomate.onrender.com"
    : "http://localhost:" + (process.env.PORT || 3000);
const axios = require("axios").create({ baseURL: apiServer, timeout: 5000 });

const list = async (req, res) => {
  let data = [];
  let title = "Mushroom sightings";
  axios
    .get("/api/sightings")
    .catch((err) => (title = err.message + "!"))
    .finally(() => res.render("list", { title, sightings: data }));
};

const details = (req, res) => {
  res.render("index", { title: "Details of mushroom sighting!" });
};

module.exports = {
  list,
  details,
};
