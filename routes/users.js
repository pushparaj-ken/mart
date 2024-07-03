const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); 

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] })); 

router.get('/home', userController.Home);

module.exports = router;