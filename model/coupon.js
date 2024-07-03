var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var couponSchema = new Schema({
  id: { type: String, default: "", required: false }, 
  store_id: { type: String, default: "", required: false }, 
  child_category: { type: String, default: "", required: true }, 
  product_id: { type: String, default: "", required: true }, 
  coupon_code: { type: String, default: "", required: true }, 
  flat_percentage: { type: String, default: "", required: true }, 
  value: { type: String, default: "", required: true }, 
  start_date: { type: String, default: "", required: true }, 
  end_date: { type: String, default: "", required: true }, 
  limits: { type: String, default: "", required: true }, 
  used: { type: String, default: "", required: true }, 
  coupon_status: { type: String, default: "", required: true }, 
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

couponSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('coupon', couponSchema);