const express = require('express');
const router = express.Router();
const sliderController = require('../../controllers/frontendsettings/slider.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'slider_image', maxCount: 10 }]), sliderController.Addslider);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'slider_image', maxCount: 10 }]), sliderController.Updateslider);

router.delete('/delete/:id', middleware.Authadmin, sliderController.Deleteslider);

router.get('/list', middleware.Authadmin, sliderController.Listslider); 

module.exports = router;