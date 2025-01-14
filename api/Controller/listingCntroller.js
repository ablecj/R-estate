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

// get the listing details of the id 
export const getListing = async (req, res, next)=> {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, 'Listing Not Found !'));
        };
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

// getListings functionality for search and find all lisitngs
export const getListings = async(req, res, next)=> {
    try {
        // limit the output
        const limit = parseInt(req.query.limit) || 9;
        // start index 
        const startIndex = parseInt(req.query.startIndex) || 0;
        // offer
        let offer = req.query.offer;
        // consdition check for there is no offer or offer is undefined
        if(offer === undefined || offer === 'false' ){
            offer = {$in: [false, true]};
        }
        // furnished
        let furnished = req.query.furnished;
        // condition for furnished is true or flase
        if(furnished === undefined || furnished === 'false'){
            furnished = { $in: [false, true]};
        }
        // parking
        let parking = req.query.parking;
        // conditon for parking is true or false 
        if(parking === undefined || parking === 'false') {
            parking = { $in: [false, true]};
        }
        // type
        let type = req.query.type;
        // condition for the type is rent or all
        if(type === undefined || type === 'all' ){
            type = {$in: ['sale', 'rent']};
        }
        // search term for searching the listings
        const searchTerm = req.query.searchTerm || '';
        // sort the result with the time 
        const sort = req.query.sort || 'createdAt' ;
        // order the sorted result
        const order = req.query.order || 'desc';

        // finding the lisitings from the listings collections
        const listings = await Listing.find({
            name: {$regex: searchTerm, $options: 'i'},
            type,
            offer,
            furnished,
            parking
        }).sort(
            {[sort]: order}

        ).limit(limit).skip(startIndex);

        return res.status(200).json(listings)


    } catch (error) {
        next(error);
    }
}



