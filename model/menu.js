var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var childmenuSchema = new Schema({
  id: { type: String, default: "", required: false },
  parentId: { type: String, default: "", required: true },
  label: { type: String, default: "", required: true },
  link: { type: String, default: "", required: false },
  icon: { type: String, default: "", required: true },
  isCollapsed: { type: String, default: "", required: true },
  isTitle: { type: Boolean, default: false, required: true },
  badge: { type: String, default: "", required: true },
  orderBy: { type: Number, default: 0, required: true },
  status: { type: Number, default: 0, required: false },
  updatedBy: { type: String, default: "", required: false },
});

var submenuSchema = new Schema({
  id: { type: String, default: "", required: false },
  parentId: { type: String, default: "", required: true },
  label: { type: String, default: "", required: true },
  link: { type: String, default: "", required: false },
  icon: { type: String, default: "", required: true },
  isCollapsed: { type: String, default: "", required: true },
  isTitle: { type: Boolean, default: false, required: true },
  badge: { type: String, default: "", required: true },
  orderBy: { type: Number, default: 0, required: true },
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
  subItems: [childmenuSchema],
});

var menuSchema = new Schema({
  id: { type: String, default: "", required: false },
  label: { type: String, default: "", required: true },
  link: { type: String, default: "", required: false },
  icon: { type: String, default: "", required: true },
  isCollapsed: { type: String, default: "", required: true },
  isTitle: { type: Boolean, default: false, required: true },
  badge: { type: String, default: "", required: true },
  isLayout: { type: Boolean, default: false, required: true },
  orderBy: { type: Number, default: 0, required: true },
  subItems: [submenuSchema],
  status: { type: Number, default: 0, required: false },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

menuSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});



menuSchema.pre('findOneAndUpdate', async function (next) {
  let menuUpdate = this.getUpdate();
  if (menuUpdate.$push && menuUpdate.$push.submenu) {
    // Update each subcategory with a new ObjectId
    this.getUpdate().$push.subItems = menuUpdate.$push.submenu.map(submenu => {
      const newId = new mongoose.Types.ObjectId()
      return {
        ...submenu,
        _id: newId,
        id: newId // Assign a new ObjectId
      } // Assign a new ObjectId
    });
  } else if (menuUpdate.$push && menuUpdate.$push['submenu.$.childmenu']) {
    const submenuUpdate = menuUpdate.$push['submenu.$.childmenu'];
    // Iterate through childcategories and update them with a new ObjectId
    this.getUpdate().$push['subItems.$.subItems'] = submenuUpdate.map(childmenu => {
      console.log("chages", childmenu);
      const newId = new mongoose.Types.ObjectId();
      return {
        ...childmenu,
        _id: newId,
        id: newId
      };
    });

  }
  next();
});




module.exports = mongoose.model('menu', menuSchema);