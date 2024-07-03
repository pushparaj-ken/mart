var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var featuredcontentSchema = new Schema({
  id: { type: String, default: "", required: false }, 
  store_id: { type: String, default: "", required: false }, 
  featured_image: { type: String, default: "", required: false }, 
  title	: { type: String, default: "", required: false }, 
  sub_title: { type: String, default: "", required: false }, 
  button_label: { type: String, default: "", required: false }, 
  button_link: { type: String, default: "", required: false },  
  orderBy: { type: Number, default: 0, required: false },
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

featuredcontentSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('featuredcontent', featuredcontentSchema);