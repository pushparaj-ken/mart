const express = require('express');
const router = express.Router();
const SectionContentController = require('../../controllers/frontendsettings/section.content.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));

const multer = require("multer");

const upload = multer({});

router.post('/add', middleware.Authadmin, upload.fields([{ name: 'sectioncontent_icon', maxCount: 10 }]), SectionContentController.Addsectioncontent);

router.put('/update/:id', middleware.Authadmin, upload.fields([{ name: 'sectioncontent_icon', maxCount: 10 }]), SectionContentController.Updatesectioncontent);

router.delete('/delete/:id', middleware.Authadmin, SectionContentController.Deletesectioncontent);

router.get('/list', middleware.Authadmin, SectionContentController.Listsectioncontent);

module.exports = router;