const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { checkJWT } = require('../middlewares/jwt');

const router = Router();

router.post('/', [check('email', 'El email es obligatorio').isEmail(), check('password', 'El password es obligatorio').not().isEmpty(), validateFields], login);

router.post('/google', [check('token', 'El token de Google es obligatorio').not().isEmpty(), validateFields], googleSignIn);

router.get('/renew', checkJWT, renewToken);

module.exports = router;
