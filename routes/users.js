const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const { checkJWT } = require('../middlewares/jwt');
const { getUsers, newUser, updUser, delUser } = require('../controllers/users');

const router = Router();

router.get('/', checkJWT, getUsers);
router.post('/', [checkJWT, check('name').not().isEmpty(), check('password').not().isEmpty(), check('email').isEmail(), validateFields], newUser);
router.put('/:id', [checkJWT, check('name').not().isEmpty(), check('email').isEmail(), check('role').not().isEmpty(), validateFields], updUser);
router.delete('/', checkJWT, delUser);
module.exports = router;
