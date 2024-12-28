import express from 'express';
import { createListing, deleteListing, updateListing, getListing } from '../Controller/listingCntroller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();


router.post('/create',verifyToken,createListing);
// route for deleting the listing data of the user 
router.delete('/delete/:id', verifyToken, deleteListing);
// route for updating the listing route 
router.post('/update/:id', verifyToken, updateListing);
// route for getting the listing details
router.get('/getListing/:id', getListing);




export default router
