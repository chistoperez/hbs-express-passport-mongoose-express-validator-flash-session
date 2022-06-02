const Url = require("../models/Url");
const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean();
    res.render("home", { urls });
  } catch (error) {
    //console.log(error);
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
    //res.send("falló algo");
  }
};
const agregarUrl = async (req, res) => {
  const { origin } = req.body;
  try {
    const url = new Url({ origin, shortURL: nanoid(8), user: req.user.id });
    await url.save();
    req.flash("mensajes", [{ msg: "URL added" }]);
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
const eliminarUrl = async (req, res) => {
  const { id } = req.params;
  try {
    //await Url.findByIdAndDelete(id);
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("That's not your URL");
    }

    await url.remove();
    req.flash("mensajes", [{ msg: "URL deleted" }]);
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();

    if (!url.user.equals(req.user.id)) {
      throw new Error("That's not your URL");
    }

    res.render("home", { url });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("That's not your URL");
    }

    await url.updateOne({ origin });
    req.flash("mensajes", [{ msg: "URL edited" }]);
    // await Url.findByIdAndUpdate(id, { origin });

    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const redireccionamiento = async (req, res) => {
  const { shortURL } = req.params;
  try {
    const urlDB = await Url.findOne({ shortURL });
    res.redirect(urlDB.origin);
  } catch (error) {
    req.flash("mensajes", [{ msg: "This URL doesn't exist" }]);
    return res.redirect("/auth/login");
  }
};

module.exports = {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redireccionamiento,
};
