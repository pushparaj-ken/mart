const express = require('express');
const router = express.Router();
const privacypolicyController = require('../../controllers/frontendsettings/privacypolicy.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));


router.post('/add', middleware.Authadmin, privacypolicyController.Addprivacypolicy);

router.put('/update/:id', middleware.Authadmin, privacypolicyController.Updateprivacypolicy);

router.delete('/delete/:id', middleware.Authadmin, privacypolicyController.Deleteprivacypolicy);

router.get('/list', middleware.Authadmin, privacypolicyController.Listprivacypolicy);

module.exports = router;