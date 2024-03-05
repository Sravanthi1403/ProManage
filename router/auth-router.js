const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth-controller');
const {registerSchema,loginSchema, updateUserSchema} = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");


router.route('/register').post(validate(registerSchema), authControllers.register);

router.route('/login').post(validate(loginSchema), authControllers.login);

router.route('/user').get(authMiddleware, authControllers.user);

router.route('/updateUser/:id').put(validate(updateUserSchema), authControllers.updateUser);

module.exports = router;