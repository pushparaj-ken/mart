const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categories/categories.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), categoryController.AddCategory);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), categoryController.UpdateCategory);

router.delete('/delete/:id', middleware.Authadmin, categoryController.DeleteCategory);

router.get('/list', middleware.Authadmin, categoryController.ListCategory);

module.exports = router;