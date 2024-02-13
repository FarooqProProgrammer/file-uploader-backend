const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });
app.use(cors())

// Define a route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    res.send({ url: fileUrl });
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
