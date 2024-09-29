const jwt = require("jsonwebtoken");

const generarJWT = (user) => {
    return jwt.sign({user}, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
};

module.exports = { generarJWT };