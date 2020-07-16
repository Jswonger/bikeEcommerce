const productModel = require('../model/product-model');

async function getProducts(req, res) {
    let products;
    switch(req.path){
        case '/':
            products = await productModel.find( {} );
            break;
        case '/trek':
            products = await productModel.find( { brand: 'trek' } );
            break;
        case '/schwinn':   
            products = await productModel.find( { brand: 'schwinn' } );
            break;
        case '/giant':   
            products = await productModel.find( { brand: 'giant' } );
            break;
        case '/mountain':   
            products = await productModel.find( { type: 'mountain' } );
            break;
        case '/cruiser':   
            products = await productModel.find( { type: 'cruiser' } );
            break;
        case '/road':   
            products = await productModel.find( { type: 'road' } );
            break;
        default:    
            products = await productModel.find( {} );
            break;
    }
    res.render('products', { products: products });
};

async function getProductWithId(req, res) {
    await productModel.findById(req.params.id).then((product) => {
        res.render('product', { product: product });
    }).catch((e) => {
        console.log(e);
        res.redirect('/');
    });
};

module.exports = { getProducts, getProductWithId };