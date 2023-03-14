const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { buildJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google');
const { getMenuFrontEnd } = require('../helpers/menu');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userDB = await Usuario.findOne({ email });

    if (!userDB) {
      return res.status(404).json({ msg: 'Email no encontrado' });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Contraseña no válida' });
    }

    const token = await buildJWT(userDB.id);
    const menu = getMenuFrontEnd(userDB.role);

    res.json({ token, menu });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hable con el administrador' });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const userDB = await Usuario.findOne({ email });
    let user;

    if (!userDB) {
      user = new User({
        name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      });
    } else {
      user = userDB;
      user.google = true;
    }

    await user.save();
    const token = await buildJWT(user.id);
    const menu = getMenuFrontEnd(user.role);
    res.json({ token, menu });
  } catch (error) {
    res.status(401).json({ msg: 'Token no es correcto' });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  const token = await buildJWT(uid);
  const user = await User.findById(uid);
  const menu = getMenuFrontEnd(user.role);
  res.json({ token, user, menu });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
