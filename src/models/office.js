const { Schema, model } = require("mongoose");
const toJson = require("@meanie/mongoose-to-json");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");
const mongoosePaginate = require("mongoose-paginate-v2");

const officeSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
    },
    url: { type: String, trim: true },
    latitude: { type: String, trim: true },
    longitude: { type: String, trim: true },
    workers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
  {
    collection: "Offices",
    logError: true,
    suppressVersionIncrement: false,
    removeVersions: false,
  }
);

officeSchema.plugin(mongoosePaginate);
officeSchema.plugin(toJson);
officeSchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });

module.exports = model("Office", officeSchema);
