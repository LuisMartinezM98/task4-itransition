const express = require("express");
const { checkAuth } = require("../middleware/cheackAuth")

const { singUp, logIn, changeAcitve, getUsersPaginated, deletedUser} = require("../controllers/User");
const { validatorSingUp, validatorLogIn, validatorChangeActive } = require("../validators/User");

const router = express.Router();

router.post('/sign-up', validatorSingUp, singUp);

router.post('/log-in', validatorLogIn, logIn);

router.get('/get-users/:page', checkAuth, getUsersPaginated);

router.put('/update-user', checkAuth, validatorChangeActive, changeAcitve);

router.delete('/delete-user', checkAuth, validatorChangeActive, deletedUser);

module.exports = router;