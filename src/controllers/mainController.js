// FETCH INSTAGRAM
const fetch = require("node-fetch");
const token = process.env.IG_ACCESS_TOKEN;
const url = `https://graph.instagram.com/me/media?fields=thumbnail_url,media_url,caption,permalink&limit=50&access_token=${token}`;
const fs = require("fs");
const path = require("path")
const productosPath = path.join(__dirname, '../data/productos.json')
//requerimo base de datos json
const {index,one,file} = require('../models/producto.model');
const {indexCat,oneCat} = require('../models/categorias.model');

//TRAER CATEGPRIAS DE LA BASE DE DATOS
const categorias = indexCat()
//TRAER PRODUCTOS DE LA BASE DE DATOS
const productos = index();      

module.exports = {
  home: async (req, res) => {
    let instaData;
    try {
      const instaFetch = await fetch(url);
      const instaJson = await instaFetch.json();
      instaData = instaJson.data;
    } catch (error) {
       console.log("Error en el servicio de Instagram: " + error);
      instaData = null;
    }

    //TRAER PRODUCTOS(ULTIMOS RESCATES) DE LA BASE DE DATOS
    const productoUltimosRescates = (productos.slice(productos.length - 10)).reverse()   
    
    res.render("home", { instaData, productos, categorias, productoUltimosRescates });
  },

  productDetail: async (req, res) => {

    const idBuscado = req.params.id   
   
    const productoBuscado = one(idBuscado)  
           
    res.render("productDetail", { productoBuscado })
  },

  categoryList: async (req, res) => {     
    const categoriaId = await req.params.categoriaId
    const productosCategoria = productos.filter( producto => producto.categoriaId == categoriaId)    

     //INICIALIZAMOS LA VARIABLE ATRIBUTOS COMO UN OBJETO VACIO
     let atributos = {}  
     // FILTROS QUE QUEREMOS APLICAR
     const filtrosAAplicar = ["talle","categorias"]
     for (let i = 0; i < productos.length; i++) {
       const producto = productos[i];
       for(const atributo of Object.keys(producto)){
         // SI LOS FILTROS A APLICAR INCLUYEN EL ATRIBUTO CONTINUA EL FOR
         if(!(filtrosAAplicar.includes(atributo)))continue
         // SI NO HAY ATRIBUTOS, ES UN OBJETO VACIO
         if(!atributos[atributo])atributos[atributo] = {}
         // SI NO HAY ATRIBUTOS EL CONTADOR SE SETEA EN 1, SI YA HAY, SE SUMA 1
         if (!(producto[atributo] in atributos[atributo]))atributos[atributo][producto[atributo]] = 1;
         else atributos[atributo][producto[atributo]] += 1;
       }        
     }   
     console.log(atributos);
    res.render('categoryList2', { productosCategoria, categoriaId, atributos})
  },

  newProduct: async (req, res) => {
       
    res.render("newProductForm", { categorias });
  },

  chargeProduct: async (req, res) => {
    const productoNuevo = await req.body;
    if (productos.length) {
      productoNuevo.id = productos.length + 1;      
    } else {
      productoNuevo.id = 1;
    }
    
    categoriaProducto = categorias.filter(
      categoria => productoNuevo.categoriaId == categoria.id
    )   
    productoNuevo.categorias = categoriaProducto[0].nombreCategoria

    productoNuevo.imagen = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        productoNuevo.imagen.push(  req.files[i].filename );        
      }
    }   
    productos.push(productoNuevo)

    const fileTxt = JSON.stringify(productos)

    fs.writeFileSync(productosPath, fileTxt)
       
    res.redirect("/");
    
},
  filterProduct: async (req, res) => {

    const categoriaId = await req.params.categoriaId
    
    // SI HAY FILTROS APLICADOS VUELVO A GUARDARLOS, SINO UTILIZO LOS QUE ESTAN EN EL SESSION
    if (req.body.precioMaximo != undefined) {
      req.session.filtros = await req.body
    }
    const filtros = req.session.filtros    
   
    //INICIALIZAMOS LA VARIABLE ATRIBUTOS COMO UN OBJETO VACIO
    let atributos = {}  
    // FILTROS QUE QUEREMOS APLICAR
    const filtrosAAplicar = ["talle","categorias"]
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      for(const atributo of Object.keys(producto)){
        // SI LOS FILTROS A APLICAR INCLUYEN EL ATRIBUTO CONTINUA EL FOR
        if(!(filtrosAAplicar.includes(atributo)))continue
        // SI NO HAY ATRIBUTOS, ES UN OBJETO VACIO
        if(!atributos[atributo])atributos[atributo] = {}
        // SI NO HAY ATRIBUTOS EL CONTADOR SE SETEA EN 1, SI YA HAY, SE SUMA 1
        if (!(producto[atributo] in atributos[atributo]))atributos[atributo][producto[atributo]] = 1;
        else atributos[atributo][producto[atributo]] += 1;
      }        
    }   

    productosCategoria = [];    
    for (let index = 0; index < productos.length; index++) {
      const producto = productos[index];
      const cumplePrecioMinimo =  !filtros.precioMinimo || +producto.precio >= +filtros.precioMinimo;
      const cumplePrecioMaximo = !filtros.precioMaximo || +producto.precio <= +filtros.precioMaximo;
      const cumpleTalle = !filtros.talle || filtros.talle.includes(producto.talle);        
      const cumpleCategorias = !filtros.categorias || filtros.categorias.includes(producto.categorias);
      const cumpleFiltros = cumplePrecioMaximo && cumplePrecioMinimo && cumpleTalle && cumpleCategorias;
      if(cumpleFiltros)productosCategoria.push(producto)
    } 
    res.render('productosFiltrados', { productosCategoria, categoriaId, filtros,atributos, oldData: [req.body]})    
  }  
};
