const fs = require('fs');
const path = require('path');
const db = require('../../database/models');

let products = fs.readFileSync(path.resolve(__dirname, '../data/productos.json'), {encoding: 'utf-8'});
products = JSON.parse(products);

let productosController = {
    detalleProducto: function(req, res, next) {
        db.Product.findByPk(req.params.id)
            .then(productDetail => {
                db.Product.findAll({ limit: 4 })
                    .then((recomendacion) => {
                        res.render('products/detalle-producto', {productDetail: productDetail, recomendacion});
                    })
                    .catch(function(error){
                        console.log(error);
                    })
            })
            .catch(function(error){
                console.log(error);
            })
    },
    buscarProducto: function(req, res){
        let busquedaUsuario = req.query.search;

        let resultadoBusqueda = [];

        products.forEach(busqueda => {
            if((busqueda.nombre).includes(busquedaUsuario)){
                resultadoBusqueda.push(busqueda)
            }
        })
        console.log(resultadoBusqueda)
        
        res.render('products/resultadoBusqueda', {resultadoBusqueda});
    },

    listadoProducto: function(req, res) {
        db.Product.findAll()
            .then(productos => {
                res.render('products/listado-productos', {productos: productos});
            })
            .catch(function(error){
                console.log(error);
            })
    },

    listadoCafes: function(req, res) {
        db.Product.findAll({
            where: {
                category_id: 1
            }
        })
            .then(cafes => {
                res.render('products/listado-cafes', {cafes: cafes});
            })
            .catch(function(error){
                console.log(error);
            })
    },

    listadoCafeteras: function(req, res) {
        db.Product.findAll({
            where: {
                category_id: 2
            }
        })
            .then(cafeteras => {
                res.render('products/listado-cafeteras', {cafeteras: cafeteras});
            })
            .catch(function(error){
                console.log(error);
            })
    },
    listadoAccesorios: function(req, res) {
        db.Product.findAll({
            where: {
                category_id: 3
            }
        })
            .then(accesorios  => {
                res.render('products/listado-accesorios', {accesorios : accesorios });
            })
            .catch(function(error){
                console.log(error);
            })
    },

    crearProducto: (req, res) => {
        res.render("products/crear-producto");
    },

    guardarProducto: (req, res, next) => {
        db.Product.create({
            name: req.body.name,
            description: req.body.descripcion,
            price: req.body.price,
            category: req.body.category_id,
            image: req.files[0].filename,
            Attribute: {
                value: req.body.attributes
            }
        }, {include: [{association: 'Attribute'}]})
        res.redirect("/productos/listado");
    },

    editarProducto: function(req, res) {
        const id = req.params.id
        let productToEdit = products.find(product => product.id == id);

        res.render('products/editar-producto', {productToEdit: productToEdit});
    },

    modificacion: (req, res) => {
        /*
        const {nombre, peso, descripcion, precio, categoria, } = req.body
    
        db.Product.update(req.body)
        */
        products.forEach(product => {
            if(req.params.id == product.id){
                product.nombre = req.body.nombre
                product.peso = req.body.peso
                product.descripcion = req.body.descripcion
                product.precio = req.body.precio
                product.categoria = req.body.categoria
                /*if (req.files[0] != undefined){
                    product.imagen = req.files[0].filename
                }*/
            }
            
            
        });
        const JSONproduct = JSON.stringify(products);
        fs.writeFileSync(path.join(__dirname, '..','data','productos.json'), JSONproduct);
        res.redirect('detalle')
    },

    eliminarProducto: function (req, res) {
        db.Product.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(
            res.redirect("/productos/listado")
        )
    },
}

module.exports = productosController