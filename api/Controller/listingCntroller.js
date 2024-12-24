import Listing from "../Models/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req,res,next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)
    } catch (error) {
        next(error);
    }
}

// function definition for deleting the user listings
export const deleteListing = async(req,res,next)=> {
    // find the item from the db and delete the value
    const listing = await Listing.findById(req.params.id);
    // check the condition where the listing is there or not 
    if(!listing) {
        return next(errorHandler(404, "Listing not found"))
    }

    if(req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete your own listings"))
    }
    // try catch for handling the data and error 
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted");
    } catch (error) {
        next(error);
    }
} 

// functionality for update listing details 
export const updateListing = async (req, res, next)=> {
     // find the item from the db and delete the value
     const listing = await Listing.findById(req.params.id);
     // check the condition where the listing is there or not 
     if(!listing) {
         return next(errorHandler(404, "Listing not found"))
     }
 
     if(req.user.id !== listing.userRef) {
         return next(errorHandler(401, "You can only delete your own listings"))
     }
     try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(updatedListing);
     } catch (error) {
        next(error);
     }
}


