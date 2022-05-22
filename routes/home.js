const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const urls = [
    { origin: "www.google.com/chistoperez", shortURL: "afasfa1" },
    { origin: "www.google.com/chistoperez2", shortURL: "afasfa2" },
    { origin: "www.google.com/chistoperez3", shortURL: "afasfa3" },
  ];
  res.render("home", { urls });
});

module.exports = router;
