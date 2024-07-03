var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storeSchema = new Schema({
  id: { type: String, default: "", required: false },
  store_id: { type: String, default: "", required: true },
  store_logo: { type: String, default: "", required: false },
  name: { type: String, default: "", required: true },
  address: { type: String, default: "", required: true },
  pincode: { type: Number, default: 0, required: true },
  gst: { type: String, default: "", required: false },
  store_mail: { type: String, default: "", required: false },
  store_phonenumber: { type: Number, default: 0, required: false },
  store_facebook: { type: String, default: "", required: false },
  store_twitter: { type: String, default: "", required: false },
  store_instagram: { type: String, default: "", required: false },
  store_youtube: { type: String, default: "", required: false },
  is_verified: { type: Number, default: 0, required: false },
  status: { type: Number, default: 0, required: false },
  generalsetting: {
    logo: { type: String, default: "", required: false },
    GST: { type: String, default: "", required: false },
    ShippingCost: { type: String, default: "", required: false },
    COD: { type: String, default: "", required: false },
  },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

storeSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('store', storeSchema);