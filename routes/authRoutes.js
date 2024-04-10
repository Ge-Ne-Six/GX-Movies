const express = require('express');
const authController = require('../controllers/authController');
// const { forgottenPass } = require('../middleware/authmiddleware');


const router = express.Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.get('/recoverPassword', authController.passRecovery_get);
router.get('/newpassword', authController.newPassword_get);
router.post('/newpassword',  authController.newPassword_post);
router.post('/confirm-otp', authController.confirmOtp_post);
router.post('/login', authController.login_post);
router.post('/recoverPassword', authController.passRecovery_post);
router.get('/logout', authController.logout_get);


module.exports = router;