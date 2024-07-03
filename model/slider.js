var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sliderSchema = new Schema({
  id: { type: String, default: "", required: false },
  store_id: { type: String, default: "", required: false },
  slider_image: { type: String, default: "", required: false },
  slider_heading: { type: String, default: "", required: false },
  slider_content: { type: String, default: "", required: false },
  enable_status: { type: String, default: "", required: false },
  slider_button_title: { type: String, default: "", required: false },
  slider_button_url: { type: String, default: "", required: false },
  type: { type: String, default: "", required: false },
  type_id: { type: String, default: "", required: false },
  orderBy: { type: Number, default: 0, required: false },
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

sliderSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



module.exports = mongoose.model('slider', sliderSchema);