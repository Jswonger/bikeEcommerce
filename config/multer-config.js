const multer = require('multer');

function initialize() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'C:\\Users\\jswon\\Desktop\\mWebapp\\eCommerce\\public\\assets\\');
        },
        filename: (req, file, cb) => {
            cb(null, '' + file.originalname);
        }
    });

    //'C:/Users/jswon/Desktop/mWebapp/eCommerce/public/assets'

    return multer({ storage: storage });
}

module.exports = initialize;