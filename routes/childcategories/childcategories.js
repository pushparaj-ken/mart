const express = require('express');
const router = express.Router();
const childcategoryController = require('../../controllers/childcategories/childcategories.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), childcategoryController.AddChildCategory);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), childcategoryController.UpdateChildCategory);

router.delete('/delete/:id', middleware.Authadmin, childcategoryController.DeleteChildCategory);

router.get('/list', middleware.Authadmin, childcategoryController.ListChildCategory);

module.exports = router;