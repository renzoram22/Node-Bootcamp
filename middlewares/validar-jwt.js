const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/user')

const validarJWT = async(req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "Falta token",
    });
  }
  try {
    const {uid} = jwt.verify(token, process.env.SECRETKEY);
    req.uid = uid;
    const authUser = await Usuario.findById({ _id:  uid})
    req.authUser = authUser;



    if(!authUser){
      return res.status(401).json({
        msg: "Token no valido = usuario no existe",
      });
    }


    if( !authUser.estado){
     return res.status(401).json({
        state: `estado ${authUser.estado}`,
        msg: "Token no valisdo = usuario estado false",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
