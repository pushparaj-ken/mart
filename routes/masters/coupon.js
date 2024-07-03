const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/masters/coupon.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));


router.post('/add', middleware.Authadmin, couponController.Addcoupon);

router.put('/update/:id', middleware.Authadmin, couponController.Updatecoupon);

router.delete('/delete/:id', middleware.Authadmin, couponController.Deletecoupon);

router.get('/list', middleware.Authadmin, couponController.Listcoupon);

module.exports = router;