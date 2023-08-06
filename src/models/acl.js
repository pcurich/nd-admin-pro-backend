const { Schema, model } = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");
const shortid = require("shortid");
const toJson = require("@meanie/mongoose-to-json");

const aclSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, trim: true, unique: true, default: shortid.generate },
    description: { type: String, required: true },
    category: { type: String },
    title: { type: String, required: true },
    url: { type: String, required: true },
    state: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
  {
    collection: "acls",
    logError: true,
    suppressVersionIncrement: false,
    removeVersions: false,
  }
);

aclSchema.plugin(mongoosePaginate);
aclSchema.plugin(toJson);
aclSchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });
module.exports = model("Acl", aclSchema);
