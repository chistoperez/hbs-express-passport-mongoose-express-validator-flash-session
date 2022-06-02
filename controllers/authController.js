const User = require("../models/User");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
require("dotenv").config();

const registerForm = (req, res) => {
  res.render("register");
};

const loginForm = (req, res) => {
  res.render("login");
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.json(errors.array());
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/register");
  }

  const { userName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) throw new Error("This user already exist");

    user = new User({ userName, email, password, tokenConfirm: nanoid() });
    await user.save();

    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSEMAIL,
      },
    });

    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: user.email, // list of receivers
      subject: "Verify your email", // Subject line
      html: `<a href="${
        process.env.PATHHEROKU || "http://localhost:5000"
      }/auth/confirmar/${user.tokenConfirm}">Verify your email</a>`, // html body
    });

    req.flash("mensajes", [
      {
        msg: "Open the verification email in your inbox, and click VERIFY YOUR EMAIL.",
      },
    ]);
    res.redirect("/auth/login");
    //res.json(user);
  } catch (error) {
    //res.json({ error: error.message });
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/register");
  }
};

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("This user doesn't exist");

    user.cuentaConfirmada = true;
    user.tokenConfirm = null;

    await user.save();
    req.flash("mensajes", [{ msg: "Verified account, please login" }]);
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
    //res.json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/login");
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("This email doesn't exist");

    if (!user.cuentaConfirmada) throw new Error("Please confirm your account");

    if (!(await user.comparePassword(password)))
      throw new Error("Incorrect password");

    //Crear sesión de usuario a través de passport
    req.login(user, function (err) {
      if (err) throw new Error("Error creating session");
      res.redirect("/");
    });
  } catch (error) {
    //console.log(error);
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
    //res.send({ error: error.message });
  }
};

const cerrarSesion = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
};

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmarCuenta,
  loginUser,
  cerrarSesion,
};
