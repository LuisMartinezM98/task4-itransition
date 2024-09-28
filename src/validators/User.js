const { check, validationResult } = require("express-validator");


const validatorSingUp = [
    check("email")
    .exists().withMessage('email is required'),
    check("password")
    .exists().withMessage('password is required'),
    check("name")
    .exists().withMessage('Name is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({ errors: errors.array() });
        }
        next();
    }
]

const validatorLogIn = [
    check("email")
    .exists().withMessage('Email is required'),
    check("password")
    .exists().withMessage('password is required'),
    (req, res, next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({errors: errors.array() });
        }
        next();
    }
]

const validatorChangeActive = [
    check("id")
    .exists().withMessage('id is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({errors: errors.array() });
        }
        next();
    }
]

module.exports = {validatorSingUp, validatorLogIn, validatorChangeActive}
