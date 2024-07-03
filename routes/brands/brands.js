const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brands/brands.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), brandController.AddBrand);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), brandController.UpdateBrand);

router.delete('/update/:id', middleware.Authadmin, brandController.DeleteBrand);

router.get('/list', middleware.Authadmin, brandController.ListBrand);

module.exports = router;