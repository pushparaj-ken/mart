var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var brandSchema = new Schema({
  id: { type: String, default: "", required: false },
  store_id: { type: String, default: "", required: true },
  name: { type: String, default: "", required: true },
  image: { type: String, default: "", required: true },
  description: { type: String, default: "", required: true },
  status: { type: Number, default: 0, required: false },
  orderBy: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

brandSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('brand', brandSchema);