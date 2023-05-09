const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/user");

const userGet = async (req, res = response) => {
  const { limit = 5, desde = 0 } = req.query;
  // const usuarios = await Usuario.find({ estado: true })
  //   .skip(Number(desde))
  //   .limit(Number(limit));

  // // const total = usuarios.length
  // const total = await Usuario.countDocuments({ estado: true })
  //   .skip(Number(desde))
  //   .limit(Number(limit));

  const [total,usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true })
      .skip(Number(desde))
      .limit(Number(limit)),
    Usuario.find({ estado: true }).skip(Number(desde)).limit(Number(limit)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const userPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({
    nombre,
    correo,
    password,
    rol,
  });

  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();
  res.json({
    usuario,
  });
};
const userPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...resto } = req.body;
  if (password) {
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: "put",
    usuario,
  });
};

const userDelete = async(req, res = response) => {
  const {id} = req.params;
  const uid = req.uid;
  const authUser = req.authUser;
  const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})

  res.json({
    usuario,
    uid,
    authUser
  });
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete,
};
