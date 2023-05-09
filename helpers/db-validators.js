const { Categoria,Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/user');


const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol){
      throw new Error(`El rol ${rol} no existe`);
    }
}

const esMailValido = async(correo) => { 
const existeMail = await Usuario.findOne({ correo });
if (existeMail) {
    throw new Error(`El mail ${correo} ya se encuentra registrado`);
}
}

const existeUsuarioPorId = async(id) => { 
    const check = await Usuario.findById(id) ;
    if (!check) {
        throw new Error(`El usuario no existe`);
    }
    }

const existeCategoria = async(id) => {
 const check = await Categoria.findById(id);
 console.log(check);
 if (!check) {
    throw new Error(`La categoria no existe`);
}
}

const existeProducto = async(id) => {
    const check = await Producto.findById(id);
    console.log(check);
    if (!check) {
       throw new Error(`El producto no existe`);
   }
   }

const coleccionesPermitidas = (coleccion = '',colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitidad, ${colecciones}`)
    }
    return true
}

module.exports = {
    esRoleValido,
    esMailValido,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}