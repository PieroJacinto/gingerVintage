const path = require('path');
const multer = require('multer');


const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        const folder = path.join(__dirname,"../../public/images/ropa")
        cb(null,folder);
    },
    filename:(req,file,cb) =>{
        const fileName = Date.now() + file.originalname;
        cb(null, fileName)
    }
})
const uploadFile = multer ({storage:storage})

module.exports = uploadFile;