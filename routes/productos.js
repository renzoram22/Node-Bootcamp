const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, esAdminRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");
const {obtenerProducto,obtenerProductos,actualizarProducto,borrarProducto,crearProductos} = require('../controllers/productos')
const {existeProducto,existeCategoria} = require('../helpers/db-validators')


const router = Router();


router.get("/", obtenerProductos);

router.get(
  "/:id",
  [
    check("id", "No es un a id de mongo").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);
//Crear Producto privado con token
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check('categoria','No es un id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos,
  ],
  crearProductos
);
//Actaulizar
router.put("/:id",[
  validarJWT,
  check("id","No es mongo ID").isMongoId(),
  check("id").custom(existeProducto),
  validarCampos
] ,actualizarProducto);

//Borrar Producto
router.delete("/:id",[
  validarJWT,
  esAdminRole,
  check("id", "No es un a id de mongo").isMongoId(),
  check("id").custom(existeProducto),
  validarCampos
],borrarProducto);

module.exports = router;