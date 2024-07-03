const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/menu/menu.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

//MAIN MENU

router.post('/add', middleware.Authadmin, menuController.AddMenu);

router.put('/update/:id', middleware.Authadmin, menuController.UpdateMenu);

router.delete('/delete/:id', middleware.Authadmin, menuController.DeleteMenu);

router.get('/list', middleware.Authadmin, menuController.ListMenu);

//SUB MENU

router.post('/subadd', middleware.Authadmin, menuController.AddSubMenu);

router.put('/subupdate/:id', middleware.Authadmin, menuController.UpdateSubMenu);

router.delete('/subdelete/:id', middleware.Authadmin, menuController.DeleteSubMenu);

router.get('/sublist', middleware.Authadmin, menuController.ListSubMenu);

//CHILD MENU

router.post('/childadd', middleware.Authadmin, menuController.AddChildMenu);

router.put('/childupdate/:id', middleware.Authadmin, menuController.UpdateChildMenu);

router.delete('/childdelete/:id', middleware.Authadmin, menuController.DeleteChildMenu);

router.get('/childlist', middleware.Authadmin, menuController.ListChildMenu);

router.get('/menulist', middleware.Authadmin, menuController.ListAllMenu);

module.exports = router;