const mongoose = require("mongoose");
const generateCustomId = require("../utils/idGenerator");

const noteSchema = new mongoose.Schema(
  {
    _id:{
      type:String,
      default:() => generateCustomId('NOTE_')
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user:{
      type: String,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model("Note", noteSchema);
