const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const { checkJWT } = require('../middlewares/jwt');

const { getDoctors, newDoctor, updDoctor, delDoctor, getDoctorById } = require('../controllers/doctors');

const router = Router();

router.get('/', checkJWT, getDoctors);

router.post('/', [checkJWT, check('name').not().isEmpty(), check('hospital', 'El hospital id debe de ser válido').isMongoId(), validateFields], newDoctor);

router.put('/:id', [checkJWT, check('name').not().isEmpty(), check('hospital', 'El hospital id debe de ser válido').isMongoId(), validateFields], updDoctor);

router.delete('/:id', checkJWT, delDoctor);

router.get('/:id', checkJWT, getDoctorById);

module.exports = router;
