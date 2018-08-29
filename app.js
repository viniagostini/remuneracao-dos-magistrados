var path     = require("path");
var express  = require("express");
var multer   = require("multer");


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

app.post("/", multer(multerConfig).single('planilhas'), (req, res) => {
    if (req.file){
        var filepath = path.join(req.file.destination, req.file.filename);
        console.log(filepath);
    }

    res.status(204).end();
});

//error handler
//TODO: Improve this
app.use((err, req, res, next) => {
    res.status(500).json({err});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('running on 3000...');
});
