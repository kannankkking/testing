const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bookController = require('../controllers/upload');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});


const upload = multer({ storage });


router.post('/', upload.fields([{ name: 'thumbnail' }, { name: 'pdf' }]), bookController.uploadBook);
router.get('/', bookController.fetchBooks); 
router.delete('/:id', bookController.deleteBook); 
router.get('/total-books', bookController.getTotalBooks);

module.exports = router;