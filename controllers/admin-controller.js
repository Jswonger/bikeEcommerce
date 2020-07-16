const bcrypt = require('bcrypt');
const Product = require('../model/product-model');
const User = require('../model/user-model');
const Contact = require('../model/contact-model');

function getUserByEmail(userEmail) {
    return User.findOne({ email: userEmail });
};

function getUserbyId(id) {
    return User.findById(id);
};

function getDashboard(req, res) {
    res.render('dashboard', { user: {
            email: req.user.email,
            isAdmin: req.user.isAdmin? '' : 'disabled'
        }
    });
};

function deleteLogout(req, res) {
    req.logout();
    res.redirect('/admin/login');
};

function getAddProduct(req, res) {
    res.render('addproduct');
};

async function postAddProduct(req, res) {
    console.log(req.file);
    const product = new Product({
        brand: req.body.brand,
        type: req.body.type,
        name: req.body.name,
        imgPath: '/assets/' + req.file.filename,
        price: req.body.price,
        desc: req.body.desc
    });
    await product.save().then(() => res.redirect('/admin/dashboard')).catch((e) => {
        console.log(e);
        res.redirect('/admin/addproduct');
    });
};

async function getViewProducts(req, res) {
    const products = await Product.find( {} );
    res.render('viewproducts', { products: products, user: req.user.isAdmin? '' : 'disabled'} );
};

async function deleteViewProducts(req, res) {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/viewproducts');
};

async function getEditProduct(req, res) {
    await Product.findById(req.params.id).then((product) => {
        res.render('editproduct', { product: product });
    }).catch((e) => {
        console.log(e);
        res.redirect('/admin/dashboard');
    });
};

async function putEditProduct(req, res) {
    await Product.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        type: req.body.type,
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc
    });
    res.redirect('/admin/viewproducts');
};

function getRegister(req, res) {
    res.render('adminreg');
};

async function postRegister(req, res) {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            hashPassword: hashPassword,
            isAdmin: req.body.isAdmin === 'true' ? true : false
        });

        await user.save().then(() => res.redirect('/admin/dashboard')).catch((e) => {
            const emessage = e.message;
            let flashmsg = ''
            if(emessage.includes('E11000')) {
                flashmsg = "Duplicate Email"
            }
            req.flash('regerror', flashmsg);
            console.log(res.locals.messages.regerror)
            return res.redirect('/admin/register');
        });
    } catch (e) {
        res.redirect('/admin/register');
    }
};

async function getViewAccounts(req, res) {
    const users = await User.find( {} );
    res.render('viewaccounts', { users: users });
};

async function deleteAccount(req, res) {
    const users = await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/viewaccounts');
};

async function getEditAccount(req, res) {
    await User.findById(req.params.id).then((user) => {
        res.render('editaccount', { user: user });
    }).catch((e) => {
        console.log(e);
        res.redirect('/admin/viewaccounts');
    });
};

async function putEditAccount(req, res) {
    const users = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin === 'true' ? true : false
    }).then(() => res.redirect('/admin/viewaccounts')).catch((e) => {
        const emessage = e.message;
        let flashmsg = ''
        if(emessage.includes('E11000')) {
            flashmsg = "Duplicate Email"
        }
        req.flash('regerror', flashmsg);
        return res.redirect('/admin/viewaccounts');
    });

    
};

async function getViewContactForms(req, res) {
    const contacts = await Contact.find( {} );
    res.render('viewcontactforms', { contacts: contacts, user: req.user.isAdmin? '' : 'disabled' } );
}

async function deleteViewContactForms(req, res) {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/viewcontactforms');
}

function getLogin(req, res) {
    res.render('adminlogin');
};

//FUNCTIONS FOR AUTHENTICATED
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
}

function notAuthenticated(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/dashboard');
}

function isAdmin(req, res, next) {
    if(req.user.isAdmin) {
        return next();
    }
    res.redirect('/admin/dashboard');
};

module.exports = {
    getUserByEmail,
    getUserbyId,
    getDashboard,
    deleteLogout,
    getAddProduct,
    postAddProduct,
    getViewProducts,
    deleteViewProducts,
    getEditProduct,
    putEditProduct,
    getRegister,
    postRegister,
    getViewAccounts,
    deleteAccount,
    getEditAccount,
    putEditAccount,
    getViewContactForms,
    deleteViewContactForms,
    getLogin,
    isAuthenticated,
    notAuthenticated,
    isAdmin
};