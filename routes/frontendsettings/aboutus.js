const express = require('express');
const router = express.Router();
const aboutusController = require('../../controllers/frontendsettings/aboutus.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'aboutus_image', maxCount: 10 }]), aboutusController.Addaboutus);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'aboutus_image', maxCount: 10 }]), aboutusController.Updateaboutus);

router.delete('/delete/:id', middleware.Authadmin, aboutusController.Deleteaboutus);

router.get('/list', middleware.Authadmin, aboutusController.Listaboutus); 

module.exports = router;