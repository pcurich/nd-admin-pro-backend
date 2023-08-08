const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const toJson = require("@meanie/mongoose-to-json");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");

const rolSchema = new Schema(
  {
    name: { type: String, required: [true, "El nombre es obligatorio"] },
    acl: [{ type: Schema.Types.ObjectId, ref: "Acl" }],
    state: { type: Boolean, default: true }, 
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
  {
    collection: "rols",
    logError: true,
    suppressVersionIncrement: false,
    removeVersions: false,
  }
);

rolSchema.plugin(mongoosePaginate);
rolSchema.plugin(toJson);
rolSchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });

module.exports = model("Rol", rolSchema);
