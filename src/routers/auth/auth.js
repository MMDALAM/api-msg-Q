const router = require('express').Router();

//****controllers****
const authController = require('../../controllers/auth/auth.controller');
const { verifyUser } = require('../../middlewares/auth.widdleware');

//****auth****
router.post('/getOtp', authController.getOtp);
router.post('/', authController.auth);
router.post('/verify', verifyUser);

module.exports = { authRouter: router };
