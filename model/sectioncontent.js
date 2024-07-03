var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sectioncontentSchema = new Schema({
  id: { type: String, default: "", required: false }, 
  store_id: { type: String, default: "", required: false }, 
  content_heading: { type: String, default: "", required: true }, 
  content_name: { type: String, default: "", required: true }, 
  sectioncontent_icon: { type: String, default: "", required: true }, 
  enable_status: { type: String, default: "", required: true }, 
  orderBy: { type: Number, default: 0, required: false },
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

sectioncontentSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('sectioncontent', sectioncontentSchema);