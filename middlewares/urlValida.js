const { URL } = require("url");
const urlValidar = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFrontend = new URL(origin);
    if (urlFrontend !== "null") {
      return next();
    } else {
      throw new Error("no válida");
    }
  } catch (error) {
    return res.send("url no válida");
  }
};

module.exports = urlValidar;
