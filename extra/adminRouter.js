const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const router = express.Router();
const methOverride = require('method-override');
const initPassport = require('../config/passport-config');
const initMulter = require('../config/multer-config');
const Product = require('../model/product-model');
const User = require('../model/user-model');

//INITIALIZE MULTER CONFIGURATION
const imgUpload = initMulter();

//INITIALIZE PASSPORT CONFIGURATION
initPassport(
    passport, 
    userEmail => {
        return User.findOne({ email: userEmail });
    },
    id => {
        return User.findById(id);
    }

);

//SET UP EXPRESS USES
router.use(flash());
router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methOverride('_method'));

// ADMIN PAGE
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: {
            email: req.user.email,
            isAdmin: req.user.isAdmin? '' : 'disabled'
        }
    });
});

router.delete('/logout', isAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/admin/login');
});

//NEW PRODUCT PAGE
router.get('/addproduct', isAuthenticated, (req, res) => {
    res.render('addproduct');
});

router.post('/addproduct', isAuthenticated, imgUpload.single('imgPath'), async (req, res) => {
    console.log(req.file);
    const product = new Product({
        brand: req.body.brand,
        type: req.body.type,
        name: req.body.name,
        imgPath: '/assets/' + req.file.filename,
        price: req.body.price,
        desc: req.body.desc
    });
    try {
        await product.save();
        res.redirect('/admin/dashboard');
    } catch (e) {
        console.log(e);
        res.redirect('/admin/dashboard');
    }
});

//VIEW PRODUCTS PAGE
router.get('/viewproducts', isAuthenticated, async (req, res) => {
    const products = await Product.find( {} );
    res.render('viewproducts', { products: products, user: req.user.isAdmin? '' : 'disabled'} );
});

router.delete('/viewproducts/:id', isAuthenticated, isAdmin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/viewproducts');
});

//EDIT PRODUCTS
router.get('/editproduct/:id', isAuthenticated, isAdmin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('editproduct', { product: product });
});

router.put('/editproduct/:id', isAuthenticated, isAdmin, async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        type: req.body.type,
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc
    });
    res.redirect('/admin/viewproducts');
});

//REGISTER PAGE
router.get('/register', isAuthenticated, isAdmin, (req, res) => {
    res.render('adminreg');
});

router.post('/register', isAuthenticated, isAdmin, async (req, res) => {
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
    
});

//LOGIN PAGE
router.get('/login', notAuthenticated, (req, res) => {
    res.render('adminlogin');
});

router.post('/login', notAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
}));

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

module.exports = router;