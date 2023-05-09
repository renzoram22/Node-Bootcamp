const { response, query } = require("express");
const {Producto} = require('../models')



//populate
const obtenerProductos = async(req,res = response) => {
    const { limit = 5, desde = 0 } = req.query;
    const query = {estado:true}
    const [total,productos] = await Promise.all([
        Producto.countDocuments(query)
          .skip(Number(desde))
          .limit(Number(limit)),
        Producto.find(query).populate('usuario','nombre').skip(Number(desde)).limit(Number(limit)),
      ]);
   
  res.json({
    total,
    productos,
  });
}

const obtenerProducto = async(req,res = response) => {
    const {id} = req.params;

    const producto = await Promise.all([
        Producto.findById(id).populate('usuario','nombre'),
      ]);
   
  res.json({
    producto,
  });
}

const actualizarProducto = async(req,res = response) => {
    const {id} = req.params;
    const {estado,usuario,...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.authUser._id;
    console.log(data.usuario);
    
    const producto = await Producto.findByIdAndUpdate(id,data,{new:true})

    res.json({
      producto
    })
}

const crearProductos = async(req,res = response) => {

    const {estado,usuario, ...body} = req.body;
    const productoDB = await Producto.findOne({nombre:body.nombre})
    if(productoDB){
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre}, ya existe`
        })
    }
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario:  req.authUser._id
    }

    const producto = new Producto(data)

    await producto.save();

    res.status(201).json(producto)


}


const borrarProducto = async(req,res = response) => {
  const {id} = req.params;

  const producto = await Producto.findByIdAndUpdate(id,{estado:false},{new:true})
  res.json({
    producto
  })

}


module.exports = {
    crearProductos,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}