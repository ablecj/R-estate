import Listing from "../Models/listingModel.js";
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
};
// delete user functionality
export const deleteUsser = async (req,res,next) =>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account !"));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted successfully !")
    } catch (error) {
        next(error);
    }
}

// get the user list from the database 
export const getUserList = async (req,res,next)=> {
    // conditional check for the req.user.id === req.params.id
    if(req.user.id === req.params.id) {
        try {
            const listing = await Listing.find({userRef: req.params.id});
            res.status(200).json(listing);
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, "you can only view your own listing"))
    }
}

// get user functionality
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        // conditional check for user is there or not 
        if(!user) return next(errorHandler(404, 'User Not Found !'));
        const {password: pass, ...rest} = user._doc;
        res.status(200).json(rest);
        
    } catch (error) {
        next(error);
    }
}








