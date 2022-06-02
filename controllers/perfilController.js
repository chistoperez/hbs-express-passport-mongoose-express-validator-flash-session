const formidable = require("formidable");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

module.exports.formPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.render("perfil", { user: req.user, imagen: user.imagen });
  } catch (error) {
    req.flash("mensajes", [{ msg: "Error reading user" }]);
    res.redirect("/perfil");
  }
};

module.exports.editarFotoPerfil = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.maxFileSize = 50 * 1024 * 1024;
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error("Upload image failed");
      }
      //console.log(fields);
      //console.log(files);
      const file = files.myFile;

      if (file.originalFilename === "") {
        throw new Error("Please select an image");
      }
      if (!(file.mimetype === "image/jpeg" || file.mimetype === "image/png")) {
        throw new Error("please select .jpg/.png images only");
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error("Image size needs to be lower than 50MB");
      }

      const extension = file.mimetype.split("/")[1];
      const dirFile = path.join(
        __dirname,
        `../public/img/perfiles/${req.user.id}.${extension}`
      );

      fs.renameSync(file.filepath, dirFile);

      const image = await Jimp.read(dirFile);
      image.resize(200, 200).quality(80).writeAsync(dirFile);

      const user = await User.findById(req.user.id);
      user.imagen = `${req.user.id}.${extension}`;
      await user.save();

      req.flash("mensajes", [{ msg: "Image uploaded" }]);
    } catch (error) {
      req.flash("mensajes", [{ msg: error.message }]);
    } finally {
      res.redirect("/perfil");
    }
  });
};
