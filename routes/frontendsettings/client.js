const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/frontendsettings/client.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'client_image', maxCount: 10 }]), clientController.Addclient);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'client_image', maxCount: 10 }]), clientController.Updateclient);

router.delete('/delete/:id', middleware.Authadmin, clientController.Deleteclient);

router.get('/list', middleware.Authadmin, clientController.Listclient); 

module.exports = router;