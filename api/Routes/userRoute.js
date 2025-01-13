import express from 'express';
import { deleteUsser, test, updateUser,getUserList, getUser } from '../Controller/userController.js';
import { verifyToken } from '../utils/verifyUser.js';



const router = express.Router();


// first route and test is defined in the usercontroller for avoiding the traffic 
router.get('/test', test);
// route for the update user
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUsser );
// route for get user list
router.get('/listings/:id', verifyToken, getUserList);
// route for get user 
router.get('/:id', verifyToken, getUser)


export default router;