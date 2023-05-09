const { response } = require("express");
const Usuario = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: `usuario o contrasena incorrecta - correo`,
      });
    }

    if (!usuario.estado) {
      return res.status(400).json({
        msg: `usuario o contrasena incorrecta - estado`,
      });
    }
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: `usuario o contrasena incorrecta - password`,
      });
    }

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el admin",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const googleUser = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo: googleUser.mail });
    if (!usuario) {
      const data = {
        nombre: googleUser.nombre,
        correo: googleUser.mail,
        password: ":(",
        img: googleUser.img,
        google: true,
        rol: "USER_ROL",
      };

      usuario = new Usuario(data);

      await usuario.save();
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con un admin",
      });
    }
    const token = await generarJWT(usuario.id);
    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Token incorrsdasecto",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
