const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const middleware = require('../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'store_logo', maxCount: 10 }]), storeController.AddStore);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'store_logo', maxCount: 10 }]), storeController.UpdateStore);

router.delete('/delete/:id', middleware.Authadmin, storeController.DeleteStore);

router.get('/list', middleware.Authadmin, storeController.ListStore);

router.post('/generalsetting/update/:id', middleware.Authadmin, storeController.GeneralSetting);

module.exports = router;