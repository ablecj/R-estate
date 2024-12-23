import express from 'express';
import { createListing, deleteListing } from '../Controller/listingCntroller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();


router.post('/create',verifyToken,createListing);
// route for deleting the listing data of the user 
router.delete('/delete/:id', verifyToken, deleteListing)




export default router
