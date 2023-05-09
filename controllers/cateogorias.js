const { response, query } = require("express");
const {Categoria} = require('../models')



//populate
const obtenerCategorias = async(req,res = response) => {
    const { limit = 5, desde = 0 } = req.query;
    const query = {estado:true}
    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query)
          .skip(Number(desde))
          .limit(Number(limit)),
        Categoria.find(query).populate('usuario','nombre').skip(Number(desde)).limit(Number(limit)),
      ]);
   
  res.json({
    total,
    categorias,
  });
}

const obtenerCategoria = async(req,res = response) => {
    const {id} = req.params;

    const categoria = await Promise.all([
        Categoria.findById(id).populate('usuario','nombre'),
      ]);
   
  res.json({
    categoria,
  });
}

const actualizarCategoria = async(req,res = response) => {
    const {id} = req.params;
    const {estado,usuario,...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.authUser._id;
    console.log(data.usuario);
    
    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true})

    res.json({
      categoria
    })
}

const crearCategorias = async(req,res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre})
    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`
        })
    }
    const data = {
        nombre,
        usuario:  req.authUser._id
    }

    const categoria = new Categoria(data)

    await categoria.save();

    res.status(201).json(categoria)


}


const borrarCategoria = async(req,res = response) => {
  const {id} = req.params;

  const categoria = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})
  res.json({
    categoria
  })

}


module.exports = {
    crearCategorias,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}