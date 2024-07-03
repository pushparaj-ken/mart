const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const middleware = require('../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});


router.post('/register', middleware.Authadmin, adminController.Register);

router.post('/login', adminController.Login);

router.put('/update/:id', middleware.Authadmin, adminController.UpdateUsers);

router.delete('/delete/:id', middleware.Authadmin, adminController.DeleteUsers);

router.get('/list', middleware.Authadmin, adminController.ListAllUsers);

router.post('/commonimage', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), adminController.UploadCommonImage);

router.post('/multipleimage', middleware.Authadmin, upload.fields([{ name: 'image', maxCount: 10 }]), adminController.UploadMultipleImage);

router.get('/categorylist', middleware.Authadmin, adminController.CategoryList);

module.exports = router;