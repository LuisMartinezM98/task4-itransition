const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findOne({
                where:{
                    id: decoded.user.id,
                    deleted_at: null
                }
            })
            if(!req.user.active){
                return res.status(401).send({msg: 'User blocked'});
            }
            return next()
        } catch (error) {
            return res.status(404).json({ msg: 'Hubo un error' })
        }
    }
    if (!token) {
        const error = new Error('Token no valido')
        res.status(401).json({ msg: error.message })
    }
    next();
}

module.exports = { checkAuth }