const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//static signup method
userSchema.statics.signup = async function (email, password) {

    //validation
    if(!email || !password){
        throw Error('Email and password are required');
    }

    if(!validator.isEmail(email)){
        throw Error('Enter valid email');
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough');
    }

    await mongoose.connect(process.env.MONGO_URL);
    //extra security check
    //console.log('enter inner signup');
    const exists = await this.findOne({email});
    //console.log('db main find successfull');
    if(exists){
        throw Error('Already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        email, password: hash
    });

    return user;

}

//static login method

userSchema.statics.login = async function(email, password) {
    await mongoose.connect(process.env.MONGO_URL);

    if(!email || !password){
        throw Error('Email and password are required');
    }

    const user = await this.findOne({email});
    
    if(!user){
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){
        throw Error('Invalid password');
    }

    return user;
}



module.exports = mongoose.model('User', userSchema);