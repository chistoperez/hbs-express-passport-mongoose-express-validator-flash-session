const express = require("express");
const { body } = require("express-validator");
const {
  loginForm,
  registerForm,
  registerUser,
  confirmarCuenta,
  loginUser,
  cerrarSesion,
} = require("../controllers/authController");
const router = express.Router();

router.get("/register", registerForm);
router.post(
  "/register",
  [
    body("userName", "Enter a valid name").trim().notEmpty().escape(),
    body("email", "Enter a valid email address")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Password minimum 6 characters")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("Password does not match");
        } else {
          return value;
        }
      }),
  ],
  registerUser
);
router.get("/confirmar/:token", confirmarCuenta);
router.get("/login", loginForm);
router.post(
  "/login",
  [
    body("email", "Enter a valid email address")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Password minimum 6 characters")
      .trim()
      .isLength({ min: 6 })
      .escape(),
  ],
  loginUser
);

router.get("/logout", cerrarSesion);

module.exports = router;
