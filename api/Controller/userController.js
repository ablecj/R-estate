import User from "../Models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';

export const test = (req,res)=> {
    res.json({message: "Api route is working!"})
}

// functionality for the update user 
export const updateUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own profile!"));
    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        },{new: true})
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
      next(error);  
    }
}