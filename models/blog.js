const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    title: {
      type: String,
      default:'Title'
    },
    description: {
      type: String,
      default:'Description'
    },
    cover_picture_url: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    is_draft: {
      type: Boolean,
      default: false
    },
    deleted_at: {
      type: String,
      default:null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
