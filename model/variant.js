var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var unitsSchema = new Schema({
  id: { type: String, default: "", required: false },
  name: { type: String, default: "", required: true },
  status: { type: Number, default: 0, required: false },
});

var variantSchema = new Schema({
  id: { type: String, default: "", required: false },
  store_id: { type: String, default: "", required: false },
  name: { type: String, default: "", required: true },
  status: { type: Number, default: 0, required: false },
  units: [unitsSchema],
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

variantSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});

variantSchema.pre('findOneAndUpdate', async function (next) {
  let variantUpdate = this.getUpdate();
  if (variantUpdate.$push && variantUpdate.$push.units) {
    // Update each subcategory with a new ObjectId
    this.getUpdate().$push.units = variantUpdate.$push.units.map(unit => {
      const newId = new mongoose.Types.ObjectId()
      return {
        ...unit,
        _id: newId,
        id: newId // Assign a new ObjectId
      } // Assign a new ObjectId
    });
  }
  next();
});



module.exports = mongoose.model('variant', variantSchema);