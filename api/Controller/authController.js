import User from '../Models/userModel.js'
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async(req,res, next)=> {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json({message: 'user created successfuly!'})   
    } catch (error) {
        next(error);
    }
}

// functionality for the sign in 
export const signin = async (req,res,next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, "User does not exist!"));
        const validPassword =  bcrypt.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, "Wrong credentials!"))
        const token = jwt.sign({id:validUser._id,},process.env.JWT_SECRET);
        const{password: pass, ...rest} = validUser._doc;

        // response
        res.cookie('acess_token', token, {httpOnly: true})
        .status(200)
        .json(rest)

    } catch (error) {
        next(error); 
    }
}



