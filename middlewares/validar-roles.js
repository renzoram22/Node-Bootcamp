const {response} = require('express');
const { validarJWT } = require("./validar-jwt");



const esAdminRole = async(req,res = response, next) => {
  
    if(!req.authUser){
        return res.status(500).json({
            msg:'Se quiere verificar el role sin validar token primero'
        })
    }

    const {rol,nombre} = req.authUser;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg:`${nombre} no es administrador - no puede hacer esto`
        })
    }

    next();
}


const tieneRole = (...roles) => {
    return (req,res = response, next) =>{

        if(!req.authUser){
            return res.status(500).json({
                msg:'Se quiere verificar el role sin validar token primero'
            })
        }

        if(!roles.includes(req.authUser.rol)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}