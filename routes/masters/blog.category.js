const express = require('express');
const router = express.Router();
const blogCategoryController = require('../../controllers/masters/blog.category.controller');
const middleware = require('../../middleware/auth');

const cors = require('cors');
router.use(cors({ origin: ['http://localhost:8080'] }));


router.post('/add', middleware.Authadmin, blogCategoryController.Addblogcategory);

router.put('/update/:id', middleware.Authadmin, blogCategoryController.Updateblogcategory);

router.delete('/delete/:id', middleware.Authadmin, blogCategoryController.Deleteblogcategory);

router.get('/list', middleware.Authadmin, blogCategoryController.Listblogcategory);

module.exports = router;