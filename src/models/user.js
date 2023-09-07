const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const toJson = require("@meanie/mongoose-to-json");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = Schema(
  {
    userName: { type: String, trim: true },
    firstName: {
      type: String,
      trim: true,
      required: [true, "Ingrese su Nombre"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Ingrese sus Apellidos"],
    },
    dni: {
      type: String,
      trim: true,
      required: [true, "Ingrese su Documento Nacional de Identidad"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Ingrese su correo electronico"],
    },
    password: {
      type: String,
      required: [true, "Ingrese una contraseña"],
      private: true,
    },
    picture: { type: String, trim: true, default: "default.png" },
    google: { type: Boolean, default: false },
    rol: {
      type: String,
      required: true,
      emun: ["ADMIN_ROLE", "USER_ROLE", "WORKER_ROLE", "AGENT_ROLE"],
    },
    state: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
  {
    collection: "users",
    logError: true,
    suppressVersionIncrement: false,
    removeVersions: false,
  }
);

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.plugin(mongoosePaginate);
userSchema.plugin(toJson);
userSchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });

module.exports = model("User", userSchema);
