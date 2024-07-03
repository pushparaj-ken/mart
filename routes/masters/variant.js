const express = require('express');
const router = express.Router();
const variantController = require('../../controllers/masters/variant.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));


router.post('/add', middleware.Authadmin, variantController.Addvariant);

router.put('/update/:id', middleware.Authadmin, variantController.Updatevariant);

router.delete('/delete/:id', middleware.Authadmin, variantController.Deletevariant);

router.get('/list', middleware.Authadmin, variantController.Listvariant);

router.post('/addunits', middleware.Authadmin, variantController.AddUnits);

router.put('/updateunits/:id', middleware.Authadmin, variantController.UpdateUnits);

router.delete('/deleteunits/:id', middleware.Authadmin, variantController.DeleteUnits);

module.exports = router;