var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var childcategorySchema = new Schema({
    id: { type: String, default: "", required: false },
    name: { type: String, default: "", required: true },
    image: { type: String, default: "", required: true },
    status: { type: Number, default: 0, required: false },
    orderBy: { type: Number, default: 0, required: true },
    show_on_homepage: { type: Number, default: 0, required: true },
    show_on_header: { type: Number, default: 0, required: true },
    createdBy: { type: String, default: "", required: false },
    updatedBy: { type: String, default: "", required: false },
});

var subcategorySchema = new Schema({
    id: { type: String, default: "", required: false },
    name: { type: String, default: "", required: true },
    image: { type: String, default: "", required: true },
    status: { type: Number, default: 0, required: false },
    orderBy: { type: Number, default: 0, required: true },
    show_on_homepage: { type: Number, default: 0, required: true },
    show_on_header: { type: Number, default: 0, required: true },
    createdBy: { type: String, default: "", required: false },
    updatedBy: { type: String, default: "", required: false },
    childcategory: [childcategorySchema],
});

var categorySchema = new Schema({
    id: { type: String, default: "", required: false },
    store_id: { type: String, default: "", required: true },
    name: { type: String, default: "", required: true },
    image: { type: String, default: "", required: true },
    orderBy: { type: Number, default: 0, required: true },
    show_on_homepage: { type: Number, default: 0, required: true },
    show_on_header: { type: Number, default: 0, required: true },
    highlight: { type: String, default: "", required: false },
    subcategory: [subcategorySchema],
    status: { type: Number, default: 0, required: false },
    createdBy: { type: String, default: "", required: false },
    updatedBy: { type: String, default: "", required: false },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

categorySchema.pre('save', function (next) {
    this.id = this._id;
    return next();
});



categorySchema.pre('findOneAndUpdate', async function (next) {
    let categoryUpdate = this.getUpdate();
    if (categoryUpdate.$push && categoryUpdate.$push.subcategory) {
        // Update each subcategory with a new ObjectId
        this.getUpdate().$push.subcategory = categoryUpdate.$push.subcategory.map(subcategory => {
            const newId = new mongoose.Types.ObjectId()
            return {
                ...subcategory,
                _id: newId,
                id: newId // Assign a new ObjectId
            } // Assign a new ObjectId
        });
    } else if (categoryUpdate.$push && categoryUpdate.$push['subcategory.$.childcategory']) {
        const subcategoryUpdate = categoryUpdate.$push['subcategory.$.childcategory'];
        // Iterate through childcategories and update them with a new ObjectId
        this.getUpdate().$push['subcategory.$.childcategory'] = subcategoryUpdate.map(childcategory => {
            console.log(childcategory);
            const newId = new mongoose.Types.ObjectId();
            return {
                ...childcategory,
                _id: newId,
                id: newId
            };
        });

    }
    next();
});




module.exports = mongoose.model('category', categorySchema);