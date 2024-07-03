var mongoose = require('mongoose');
const variant = require('./variant');
var Schema = mongoose.Schema;

var variantSchema = new Schema({
  id: { type: String, default: "", required: false },
  variantid: { type: String, default: "", required: false },
  unitid: { type: String, default: "", required: false },
  variantmrp: { type: Number, default: "", required: false },
  variantsellingprice: { type: Number, default: "", required: false },
  variantresellerprice: { type: Number, default: "", required: false },
  variantproductgst: { type: Number, default: "", required: false },
});

var productSchema = new Schema({
  id: { type: String, default: "", required: false },
  store_id: { type: String, default: "", required: false },
  productname: { type: String, default: "", required: false },
  brand: { type: String, default: "", required: false },
  category: { type: String, default: "", required: false },
  subcategory: { type: String, default: "", required: false },
  childcategory: { type: String, default: "", required: false },
  mrpprice: { type: Number, default: 0, required: false },
  sellingprice: { type: Number, default: 0, required: false },
  resellerprice: { type: Number, default: 0, required: false },
  productgst: { type: String, default: "", required: false },
  productfeaturedimage: { type: String, default: "", required: false },
  producthoverfeaturedimage: { type: String, default: "", required: false },
  shortdescription: { type: String, default: "", required: false },
  description: { type: String, default: "", required: false },
  orderBy: { type: Number, default: 0, required: false },
  productimage: { type: Array, default: [], required: false },
  variant: [variantSchema],
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

productSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});

productSchema.pre('findOneAndUpdate', async function (next) {
  let variantUpdate = this.getUpdate();
  if (variantUpdate.$push && variantUpdate.$push.variant) {
    // Update each subcategory with a new ObjectId
    this.getUpdate().$push.variant = variantUpdate.$push.variant.map(variant => {
      const newId = new mongoose.Types.ObjectId()
      return {
        ...variant,
        _id: newId,
        id: newId
      } // Assign a new ObjectId
    });
  }
  next();
});


module.exports = mongoose.model('product', productSchema);