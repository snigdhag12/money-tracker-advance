const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'});
}

//login user

const loginUser = async (req, res) => {
    const { email, password} = req.body;
    try {
        const user = await User.login(email, password);

        //create a token
        const token = createToken(user._id);
        res.status(200).send({email, token});
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
}

//signup
const signupUser = async (req, res) => {
    const { email, password } = req.body;
    //console.log(email, password);
    try {
        const user = await User.signup(email, password);
        //create a token
        const token = createToken(user._id);
        res.status(200).send({email, token});
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
}

module.exports = { signupUser, loginUser}