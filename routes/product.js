const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const middleware = require('../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'productfeaturedimage', maxCount: 10 }, { name: 'producthoverfeaturedimage', maxCount: 10 }]), productController.AddProduct);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'productfeaturedimage', maxCount: 10 }, { name: 'producthoverfeaturedimage', maxCount: 10 }]), productController.UpdateProduct);

router.delete('/delete/:id', middleware.Authadmin, productController.DeleteProduct);

router.get('/list', middleware.Authadmin, productController.ListProduct);

router.put('/updateproduct/:id', middleware.Authadmin, productController.UpdateProductDeatils);


router.post('/addvariant', middleware.Authadmin, productController.AddVariant);

router.put('/updatevariant/:id', middleware.Authadmin, productController.UpdateVariant);

router.delete('/deletevariant/:id', middleware.Authadmin, productController.DeleteVariant);


module.exports = router;