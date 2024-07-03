const express = require('express');
const router = express.Router();
const subcategoryController = require('../../controllers/subcategories/subcategories.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), subcategoryController.AddSubCategory);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), subcategoryController.UpdateSubCategory);

router.delete('/delete/:id', middleware.Authadmin, subcategoryController.DeleteSubCategory);

router.get('/list', middleware.Authadmin, subcategoryController.ListSubCategory);

module.exports = router;