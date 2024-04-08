const express = require('express');
const authController = require('../controllers/authController');
const { loginAuth } = require('../middleware/authmiddleware');


const router = express.Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.get('/recoverPassword', authController.passRecovery_get);
router.post('/login', authController.login_post);
router.post('/recoverPassword', authController.passRecovery_post);
router.get('/logout', authController.logout_get);


module.exports = router;