import User from '../Models/userModel.js'
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

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