const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const toJson = require("@meanie/mongoose-to-json");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Ingrese el nombre"],
    },
    state: { type: Boolean, default: true },
    picture: { type: String, trim: true, default: "default.png"  },
    color: { type: String },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
  {
    collection: "categorys",
    logError: true,
    suppressVersionIncrement: false,
    removeVersions: false,
  }
);

categorySchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

categorySchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(toJson);
categorySchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });

module.exports = model("Category", categorySchema);
