const about = (req, res) => {
  res.render("index", { title: "This is shroomate!" });
};

module.exports = {
  about,
};
