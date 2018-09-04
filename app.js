const path     = require("path");
const express  = require("express");
const multer   = require("multer");
const parserController = require('./parserController');

var app = express();

const multerConfig = {
    fileFilter: (req, file, cb) => {
        const filetypes = /zip/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }, 
    dest:'./uploads/'
};

app.post("/", multer(multerConfig).single('planilhas'), parserController.parseZippedSheets);

//error handler
//TODO: Improve this
app.use((err, req, res, next) => {
    res.status(500).json({err});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('running on 3000...');
});
