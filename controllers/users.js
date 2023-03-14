const { response } = require('express');
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { buildJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  const [users, total] = await Promise.all([User.find({}, 'name email role google img').skip(desde).limit(5), User.countDocuments()]);

  res.json({
    users,
    total,
  });
};

const newUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ ok: false, msg: 'El correo ya está registrado' });
    }

    const user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await user.save();

    const token = await generarJWT(user.id);
    res.json({ ok: true, user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Error inesperado... revisar logs' });
  }
};

const updUser = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto

  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({ msg: 'No existe un usuario por ese id' });
    }

    const { password, google, email, ...campos } = req.body;

    if (userDB.email !== email) {
      const existEmail = await User.findOne({ email });

      if (existEmail) {
        return res.status(400).json({ ok: false, msg: 'El correo ya está registrado' });
      }
    }

    if (!userDB.google) {
      campos.email = email;
    } else if (userDB.email !== email) {
      return res.status(400).json({ msg: 'Usuario de google no pueden cambiar su correo' });
    }

    const userUpd = await User.findByIdAndUpdate(uid, campos, { new: true });

    res.json({ user: userUpd });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error inesperado' });
  }
};

const delUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({ msg: 'No existe un usuario por ese id' });
    }

    await User.findByIdAndDelete(uid);
    res.json({ msg: 'Usuario eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error inesperado' });
  }
};

module.exports = {
  getUsers,
  newUser,
  updUser,
  delUser,
};
