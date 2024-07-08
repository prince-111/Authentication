const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const userSchema = new mongoose.Schema({
  _id:{
    type: String,
    default:()=> generateCustomId('USR_')
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: { 
    type: String, 
    unique: true,
    required: true, 
  },
  password:{
   type: String,
   required: true,
  },
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin", "User"], default: "User",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isVerifiedToken:{type:Boolean, default: false},
  verificationToken: {type:String, default: null},
  resetPasswordToken: {type:String, default: null},
  resetPasswordExpire: {type: Date, default: null},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{_id: false});

const User = mongoose.model("User", userSchema);

module.exports = User;