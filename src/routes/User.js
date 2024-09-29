const express = require("express");
const { checkAuth } = require("../middleware/cheackAuth")

const { singUp, logIn, changeAcitve, getUsersPaginated, deletedUser, blockAllUsers, activeAllUsers} = require("../controllers/User");
const { validatorSingUp, validatorLogIn, validatorChangeActive } = require("../validators/User");

const router = express.Router();

router.post('/sign-up', validatorSingUp, singUp);

router.post('/log-in', validatorLogIn, logIn);

router.get('/get-users/:page', checkAuth, getUsersPaginated);

router.put('/update-user', checkAuth, validatorChangeActive, changeAcitve);

router.put('/delete-user', checkAuth, validatorChangeActive, deletedUser);

router.get("/block-all", checkAuth, blockAllUsers);

router.get("/active-all", checkAuth, activeAllUsers);

module.exports = router;