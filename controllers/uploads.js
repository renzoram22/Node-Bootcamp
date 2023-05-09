const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const path = require('path');
const fs = require('fs');


const cargarArchivo = async (req, res = response) => {


  if (!req.files.archivo) {
    res.status(400).json({ msg: "Falta Nombre archivo" });
    return;
  }

  try {
    const nombre = await subirArchivo(req.files, undefined, "imagenes");

    res.json({
      nombre,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `El ${id} no es valido`,
        });
      }
      

      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
       return res.status(400).json({
          msg: `El ${id} no es valido`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "No validado",
      });
      break;
  }

  if(modelo.img){
    const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
  }



  const nombre = await subirArchivo(req.files, undefined, coleccion);

  modelo.img = nombre;

  await modelo.save()

  res.json({
    modelo
  });
};

const mostrarImagen = async(req,res = response) => {
    const {id,coleccion} = req.params;
    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `El ${id} no es valido`,
          });
        }
        
  
        break;
      case "productos":
        modelo = await Producto.findById(id);
        if (!modelo) {
         return res.status(400).json({
            msg: `El ${id} no es valido`,
          });
        }
        break;
  
      default:
        return res.status(500).json({
          msg: "No validado",
        });
        break;
    }
  
    if(modelo.img){
      const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
      if(fs.existsSync(pathImagen)){
       return res.sendFile(pathImagen)
    }
    }

    const pathSinImagen = path.join(__dirname,'../assets/no-image.jpg');

    res.sendFile(pathSinImagen)

}


module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen
};
