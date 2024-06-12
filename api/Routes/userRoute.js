import express from 'express';
import { test } from '../Controller/userController.js';



const router = express.Router();


// first route and test is defined in the usercontroller for avoiding the traffic 
router.get('/test', test);


export default router;