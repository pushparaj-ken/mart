var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var AdminuserSchema = new Schema({
  id: { type: String, default: "", required: false },
  email: { type: String, default: "", required: true },
  password: { type: String, default: "", required: false },
  name: { type: String, default: "", required: true },
  mobile: { type: Number, default: 0, required: true },
  roleId: { type: String, default: "", required: true },
  store_id: { type: String, default: "", required: true },
  status: { type: Number, default: 0, required: true },
  createdBy: { type: String, default: "", required: false },
  updatedBy: { type: String, default: "", required: false },
},
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)
AdminuserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

AdminuserSchema.pre('save', function (next) {
  this.id = this._id;
  return next();
});

AdminuserSchema.methods.getJWTToken = function () {
  const expiresInMinutes = process.env.JWT_EXPIRE;
  const expirationTimeInSeconds = expiresInMinutes * 60;

  //const expirationTimestamp = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: expirationTimeInSeconds,
  });
};

// Compare Password

AdminuserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('AdminUsers', AdminuserSchema);