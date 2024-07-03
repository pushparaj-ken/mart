var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privacypolicySchema = new Schema({
  id: { type: String, default: "", required: false }, 
  store_id: { type: String, default: "", required: false }, 
  privacy_policy: { type: String, default: "", required: false }, 
  orderBy: { type: Number, default: 0, required: false },
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

privacypolicySchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('privacypolicy', privacypolicySchema);