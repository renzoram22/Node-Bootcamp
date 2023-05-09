const { Router } = require("express");
const { check } = require("express-validator");
const {validarCampos,validarJWT,tieneRole,esAdminRole} = require('../middlewares')

const {
  esRoleValido,
  esMailValido,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const {
  userGet,
  userPost,
  userPut,
  userDelete,
} = require("../controllers/users");
const router = Router();

router.get("/", userGet);
router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  userPut
);
router.post(
  "/",
  [
    check("correo", "Correo no valido").isEmail(),
    check("correo").custom(esMailValido),
    check("nombre", "Nombre Obligatorio").not().isEmpty(),
    check("password", "Password debe tener mas de 6 letras").isLength({
      min: 6,
    }),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  userPost
);
router.delete("/:id",[
  validarJWT,
  // esAdminRole,
  tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
  check("id", "No es un ID valido").isMongoId(),
  check("id").custom(existeUsuarioPorId),
  validarCampos
], userDelete);

module.exports = router;
