const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const router = express.Router();
const methOverride = require('method-override');
const initPassport = require('../config/passport-config');
const initMulter = require('../config/multer-config');

//GET CONTROLLERS
const {
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
} = require('../controllers/admin-controller');

//INITIALIZE MULTER CONFIGURATION
const imgUpload = initMulter();

//INITIALIZE PASSPORT CONFIGURATION
initPassport(passport, getUserByEmail, getUserbyId);

//SET UP EXPRESS USES
router.use(flash());
router.use(session({
    secret: 'ENTER_BETTER_SECRET_HERE',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1800000
    }
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methOverride('_method'));

// ADMIN PAGE
router.get('/dashboard', isAuthenticated, getDashboard);

router.delete('/logout', isAuthenticated, deleteLogout);

//NEW PRODUCT PAGE
router.get('/addproduct', isAuthenticated, getAddProduct);

router.post('/addproduct', isAuthenticated, imgUpload.single('imgPath'), postAddProduct);

//VIEW PRODUCTS PAGE
router.get('/viewproducts', isAuthenticated, getViewProducts);

router.delete('/viewproducts/:id', isAuthenticated, isAdmin, deleteViewProducts);

//EDIT PRODUCTS
router.get('/editproduct/:id', isAuthenticated, isAdmin, getEditProduct);

router.put('/editproduct/:id', isAuthenticated, isAdmin, putEditProduct);

//REGISTER PAGE
router.get('/register', isAuthenticated, isAdmin, getRegister);

router.post('/register', isAuthenticated, isAdmin, postRegister);

//VIEW/EDIT/DELETE ACCOUNTS
router.get('/viewaccounts', isAuthenticated, isAdmin, getViewAccounts);

router.delete('/viewaccounts/:id', isAuthenticated, isAdmin, deleteAccount);

router.get('/editaccount/:id', isAuthenticated, isAdmin, getEditAccount);

router.put('/editaccount/:id', isAuthenticated, isAdmin, putEditAccount);

//VIEW CONTACT FORMS
router.get('/viewcontactforms', isAuthenticated, getViewContactForms);

router.delete('/viewcontactforms/:id', isAuthenticated, isAdmin, deleteViewContactForms);

//LOGIN PAGE
router.get('/login', notAuthenticated, getLogin);

router.post('/login', notAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
}));

module.exports = router;