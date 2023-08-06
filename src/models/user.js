const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
var mongoosePaginate = require("mongoose-paginate-v2");
const toJson = require("@meanie/mongoose-to-json");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");

const userSchema = Schema(
  {
    userName: { type: String, trim: true },
    firstName: { type: String, trim: true, required: "Ingrese su Nombre" },
    lastName: { type: String, trim: true, required: "Ingrese sus Apellidos" },
    dni: {
      type: String,
      trim: true,
      required: "Ingrese su Documento Nacional de Identidad",
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: "Ingrese su correo electronico",
    },
    password: {
      type: String,
      required: true,
      required: "Ingrese una contraseña",
      private: true,
    },
    state: { type: Boolean, default: true },
    picture: { type: String },
    rolId: { type: Schema.Types.ObjectId, ref: "Rol" },
    deleted: { type: Boolean, default: false },
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
