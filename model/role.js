var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
  id: { type: String, default: "", required: false },
  name: { type: String, default: "", required: true },
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
  permissions: [
    {
      id: { type: String, default: "", required: true },
      menuid: { type: String, default: "", required: true },
      read: { type: Boolean, default: false, required: true },
      write: { type: Boolean, default: false, required: true },
      edit: { type: Boolean, default: false, required: true },
      delete: { type: Boolean, default: false, required: true },
      menuname: { type: String, default: "", required: true },
    }
  ],
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

roleSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('role', roleSchema);