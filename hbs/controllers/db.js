const apiServer =
  process.env.BASE_URL ? process.env.BASE_URL : 
    "http://localhost:" + (process.env.PORT || 3000);
const axios = require("axios").create({ baseURL: apiServer, timeout: 5000 });

const init = async (req, res) => {
  let title = "Initialized db";
  axios
    .get("api/db/init")
    .catch((err) => (title = err.message))
    .finally(() => res.render("index", {title}));
};

const drop = async (req, res) => {
    let title = "Dropped db";
    axios
        .get("api/db/drop")
        .catch((err) => (title = err.message))
        .finally(() => res.render("index", { title }));
};

module.exports = {
  init,
  drop,
};
