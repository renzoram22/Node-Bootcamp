const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, esAdminRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearCategorias,
  obtenerCategoria,
  obtenerCategorias,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/cateogorias");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

//Obtener todas las categorias Publico
router.get("/", obtenerCategorias);

router.get(
  "/:id",
  [
    check("id", "No es un a id de mongo").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);
//Crear Categoria privado con token
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategorias
);
//Actaulizar
router.put("/:id",[
  validarJWT,
  check('nombre','El nombre es obligatorio').not().isEmpty(),
  check("id").custom(existeCategoria),
  validarCampos
] ,actualizarCategoria);

//Borrar categoria
router.delete("/:id",[
  validarJWT,
  esAdminRole,
  check("id", "No es un a id de mongo").isMongoId(),
  check("id").custom(existeCategoria),
  validarCampos
],borrarCategoria);

module.exports = router;
