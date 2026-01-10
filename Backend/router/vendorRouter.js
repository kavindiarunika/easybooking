import { registervendor  ,sendOtp, logincontroller} from '../controller/VendorController.js';
import express from 'express';

const vendorrouter = express.Router();

vendorrouter.post('/registervendor' , registervendor)
vendorrouter .post('/sendotp' , sendOtp)
vendorrouter .post('/login' , logincontroller)

export default vendorrouter;