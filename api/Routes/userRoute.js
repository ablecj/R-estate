import express from 'express';
import { test, updateUser } from '../Controller/userController.js';
import { verifyToken } from '../utils/verifyUser.js';



const router = express.Router();


// first route and test is defined in the usercontroller for avoiding the traffic 
router.get('/test', test);
// route for the update user
router.post('/update/:id', verifyToken, updateUser);


export default router;