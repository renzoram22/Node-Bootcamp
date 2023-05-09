const  validarJWT  = require("../middlewares/validar-jwt");
const validarCampos = require("../middlewares/validar-campos.js");
const validaRoles= require("../middlewares/validar-roles");
const validarArchivo = require('../middlewares/validar-archivo')


module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}