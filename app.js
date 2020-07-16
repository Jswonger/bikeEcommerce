const express = require('express');
const app = express();
const mongoose = require('mongoose')
const productRoute = require('./routes/productRouter');
const adminRoute = require('./routes/adminRouter');
const Contact = require('./model/contact-model');

mongoose.connect('mongodb+srv://test:test1@cluster0-pgcet.mongodb.net/ecom?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.set('view engine', 'ejs')

app.use(express.static('./public'));
app.use(express.urlencoded( {extended: false} ));

app.use('/products', productRoute);
app.use('/admin', adminRoute)

app.get('/', (req, res) => {
    res.render('home', { footerName: 'Joshua Swonger' });
})

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {

    res.render('contact', { 
            alert: '', 
            display: 'style=display:none;', 
            submsg: '',
            info: {
                name: '',
                email: '',
                desc: ''
            }
        });
});

app.post('/contact', async (req, res) => {
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        desc: req.body.desc
    });

    await contact.save().then(() => {
            res.render('contact', {
                alert: 'success-alert', 
                display: '', 
                submsg: 'Your request has been succefully submitted!',
                info: {
                    name: '',
                    email: '',
                    desc: ''
                }
            })
        }).catch((e) => {
            console.log(e);
            res.render('contact', { 
                alert: 'error-alert', 
                display: '', 
                submsg: 'An error has occurred! Please try again.',
                info: {
                    name: req.body.name,
                    email: req.body.email,
                    desc: req.body.desc
                }
            });
    });

    ;
});

app.listen(3000);
console.log("LISTENING ON PORT 3000");