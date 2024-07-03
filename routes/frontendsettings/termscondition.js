const express = require('express');
const router = express.Router();
const termsconditionController = require('../../controllers/frontendsettings/termscondition.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));


router.post('/add', middleware.Authadmin, termsconditionController.Addtermscondition);

router.put('/update/:id', middleware.Authadmin, termsconditionController.Updatetermscondition);

router.delete('/delete/:id', middleware.Authadmin, termsconditionController.Deletetermscondition);

router.get('/list', middleware.Authadmin, termsconditionController.Listtermscondition);

module.exports = router;