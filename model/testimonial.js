var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testimonialSchema = new Schema({
  id: { type: String, default: "", required: false }, 
  store_id: { type: String, default: "", required: false }, 
  testimonial_image: { type: String, default: "", required: false }, 
  name: { type: String, default: "", required: false }, 
  position: { type: String, default: "", required: false }, 
  rating: { type: String, default: "", required: false }, 
  review_content: { type: String, default: "", required: false },  
  orderBy: { type: Number, default: 0, required: false },
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

testimonialSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('testimonial', testimonialSchema);