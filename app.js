var createError = require('http-errors');
var express = require('express');
const helmet = require('helmet');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var AdminRouter = require('./routes/admin');
var StoreRouter = require('./routes/store');
var ProductRouter = require('./routes/product');
var RoleRouter = require('./routes/role');
var BlogcategoryRouter = require('./routes/masters/blog.category');
var VariantRouter = require('./routes/masters/variant');
var CouponRouter = require('./routes/masters/coupon');
var CategoriesRouter = require('./routes/categories/categories');
var SubCategoriesRouter = require('./routes/subcategories/subcategories');
var childCategoriesRouter = require('./routes/childcategories/childcategories');
var BrandsRouter = require('./routes/brands/brands');
var MenuRouter = require('./routes/menu/menu');
var sliderRouter = require('./routes/frontendsettings/slider');
var sectioncontentRouter = require('./routes/frontendsettings/sectioncontent');
var featuredcontentRouter = require('./routes/frontendsettings/featuredcontent');
var testimonialRouter = require('./routes/frontendsettings/testimonial');
var clientRouter = require('./routes/frontendsettings/client');
var aboutusRouter = require('./routes/frontendsettings/aboutus');
var privacypolicyRouter = require('./routes/frontendsettings/privacypolicy');
var termsconditionRouter = require('./routes/frontendsettings/termscondition');
const loggingMiddleware = require('./config/loggingMiddleware');

var app = express();



var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_ADDRESS);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'https://ecommerce.ezurr.com'] // Replace with your React app's origin
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(loggingMiddleware);
app.use(helmet());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/admins', AdminRouter);
app.use('/api/admins/store', StoreRouter);
app.use('/api/admins/product', ProductRouter);
app.use('/api/admins/role', RoleRouter);
app.use('/api/admins/blogcategory', BlogcategoryRouter);
app.use('/api/admins/variant', VariantRouter);
app.use('/api/admins/coupon', CouponRouter);
app.use('/api/admins/categories', CategoriesRouter);
app.use('/api/admins/subcategories', SubCategoriesRouter);
app.use('/api/admins/childcategories', childCategoriesRouter);
app.use('/api/admins/brands', BrandsRouter);
app.use('/api/admins/menu', MenuRouter);
app.use('/api/admins/slider', sliderRouter);
app.use('/api/admins/sectioncontent', sectioncontentRouter);
app.use('/api/admins/featuredcontent', featuredcontentRouter);
app.use('/api/admins/testimonial', testimonialRouter);
app.use('/api/admins/client', clientRouter);
app.use('/api/admins/aboutus', aboutusRouter);
app.use('/api/admins/privacypolicy', privacypolicyRouter);
app.use('/api/admins/termscondition', termsconditionRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
