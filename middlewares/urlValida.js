const { URL } = require("url");
const urlValidar = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFrontend = new URL(origin);
    if (urlFrontend !== "null") {
      if (
        urlFrontend.protocol === "http:" ||
        urlFrontend.protocol === "https:"
      ) {
        return next();
      }
      throw new Error("needed https://");
    }
    throw new Error("not a valid URL");
  } catch (error) {
    if (error.message === "Invalid URL") {
      req.flash("mensajes", [{ msg: "not a valid URL" }]);
    } else {
      req.flash("mensajes", [{ msg: error.message }]);
    }
    return res.redirect("/");
  }
};

module.exports = urlValidar;
