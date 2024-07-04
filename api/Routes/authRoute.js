import express from "express";
import { google, signin, signOut, signup } from "../Controller/authController.js";

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google',google);
router.get('/signout', signOut)

export default router