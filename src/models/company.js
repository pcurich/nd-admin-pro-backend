const { Schema, model } = require("mongoose");
const toJson = require("@meanie/mongoose-to-json");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");
const mongoosePaginate = require("mongoose-paginate-v2");

const companySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    documentType: { type: String, default: "RUC", emun: ["RUC"] },
    documentValue: {
      type: String,
      required: [true, "El documento es obligatorio"],
      unique: true,
      trim: true,
    },
    logo: { type: String, trim: true, default: "default.png" },
    agents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    offices: [{ type: Schema.Types.ObjectId, ref: "Office" }],
    state: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
  {
    collection: "companies",
    logError: true,
    suppressVersionIncrement: false,
    removeVersions: false,
  }
);

companySchema.plugin(mongoosePaginate);
companySchema.plugin(toJson);
companySchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });

module.exports = model("Company", companySchema);
