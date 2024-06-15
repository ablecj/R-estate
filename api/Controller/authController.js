import User from '../Models/userModel.js'
import bcrypt from 'bcryptjs';

export const signup = async(req,res)=> {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json({message: 'user created successfuly!'})   
    } catch (error) {
        res.status(500).json(error.message);
    }
}