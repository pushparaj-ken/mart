var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogcategorySchema = new Schema({
  id: { type: String, default: "", required: false }, 
  store_id: { type: String, default: "", required: false }, 
  name: { type: String, default: "", required: true }, 
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

blogcategorySchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('blogcategory', blogcategorySchema);