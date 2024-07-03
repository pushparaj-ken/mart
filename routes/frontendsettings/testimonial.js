const express = require('express');
const router = express.Router();
const testimonialController = require('../../controllers/frontendsettings/testimonial.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'testimonial_image', maxCount: 10 }]), testimonialController.Addtestimonial);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'testimonial_image', maxCount: 10 }]), testimonialController.Updatetestimonial);

router.delete('/delete/:id', middleware.Authadmin, testimonialController.Deletetestimonial);

router.get('/list', middleware.Authadmin, testimonialController.Listtestimonial); 

module.exports = router;