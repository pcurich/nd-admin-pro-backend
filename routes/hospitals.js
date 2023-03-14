const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const { checkJWT } = require('../middlewares/jwt');

const { getHospitals, newHospital, updHospital, delHospital } = require('../controllers/hospitals');

const router = Router();

router.get('/', getHospitals);

router.post('/', [checkJWT, check('name').not().isEmpty(), validateFields], newHospital);

router.put('/:id', [checkJWT, check('name').not().isEmpty(), validateFields], updHospital);

router.delete('/:id', checkJWT, delHospital);

module.exports = router;
