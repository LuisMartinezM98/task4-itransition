const { Op } = require("sequelize");
const { generarJWT } = require("../helpers/generateJWT");
const User = require("../models/User");
const crypto = require("crypto")


function verifyPassword(password, storedPassword){
    const hash = crypto.createHash('sha256').update(password).digest('hex');

    return hash === storedPassword
}

const singUp = async (req, res) => {
    const { email, password, name } = req.body;

    const emailUsed = await User.findOne({
        where: {
            email: email,
            deleted_at: {
                [Op.ne]: null
            }
        }
    });
    if(emailUsed){
        const err = new Error('This email has already used');
        return res.status(400).json({msg: err.message});
    }
    try {
        const hash = await crypto.createHash('sha256').update(password).digest('hex');
        req.body.password = hash;
        await User.create(req.body);
        return res.status(200).send({msg: 'User created'})
    } catch (error) {
        console.log(error);
        const err = new Error('Something was wrong');
        return res.status(400).send({msg: err.message});
    }
}

const logIn = async(req, res) => {
    const {email, password} = req.body;
    const usuario = await User.findOne({
        where: {
            email: email
        },
    });
    if(!usuario){
        const err = new Error('Email not found');
        return res.status(404).send({msg: err.message});
    }
    const isMatch = verifyPassword(password, usuario.password);
    if(!isMatch){
        const err = new Error('Password incorrect');
        return res.status(400).send({msg: err.message});
    }
    if(!usuario.active){
        const err = new Error('User blocked');
        return res.status(401).send({msg: err.message});
    }
    usuario.last_conection = new Date();
    await usuario.save();
    return res.status(200).send(generarJWT(usuario.id));
}

const getUsersPaginated = async (req, res) => {
    try {
      const page = Number.isNaN(parseInt(req.params.page, 10)) ? 1 : parseInt(req.params.page, 10);
      const limit = 1;
      const offset = (page - 1) * limit;
      const users = await User.findAndCountAll({
        limit: limit,
        offset: offset,
        where: {
          deleted_at: {
            [Op.is]: null
          },
        },
        attributes: {
            exclude: ['password', 'updated_at']
        },
        order: [['created_at', 'DESC']]
      });
      const objectUsers = {
        totalUsers: users.count,
        totalPages: Math.ceil(users.count / limit),
        currentPage: page,
        users: users.rows
      };
      return res.status(200).json(objectUsers);
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ message: 'Error fetching users', error: error.message });
      }
    }
  };
  
const changeAcitve = async(req, res) => {
    const { id } = req.body;
    const user = await User.findOne({
        where: {
            id: id
        }
    });
    user.active = !user.active;
    await user.save();
    return res.status(200).send({msg: 'Update successful'});
}

const deletedUser = async(req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findOne({
            where:{
                id: id
            }
        });
        user.deleted_at = new Date();
        await user.save();
        return res.status(200).send({msg: 'User deleted'})
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg: 'Something was wrong'})
    }
}


module.exports = {singUp, logIn, changeAcitve, getUsersPaginated, deletedUser}