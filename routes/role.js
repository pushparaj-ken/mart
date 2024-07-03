const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const middleware = require('../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));


router.post('/add', middleware.Authadmin, roleController.AddRole);

router.put('/update/:id', middleware.Authadmin, roleController.UpdateRole);

router.delete('/delete/:id', middleware.Authadmin, roleController.DeleteRole);

router.get('/list', middleware.Authadmin, roleController.ListRole);

router.get('/rolelist/:id', middleware.Authadmin, roleController.GetRoleInAdmin);

module.exports = router;